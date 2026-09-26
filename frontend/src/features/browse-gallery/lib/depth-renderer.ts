const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D artwork;
uniform sampler2D depth;
uniform vec2 pointer;
uniform float aspect;
varying vec2 uv;
void main() {
  // Overscan grows only while moving; the resting image retains its full framing.
  float movement = min(length(pointer), 1.0);
  vec2 base = (uv - 0.5) * (1.0 - 0.035 * movement) + 0.5;
  vec2 offset = pointer * vec2(0.018, 0.018 * aspect);
  // A single continuous lookup avoids oscillation across sharp depth boundaries.
  float distance = texture2D(depth, base).r - 0.5;
  vec2 sampleUv = base - offset * distance;
  gl_FragColor = texture2D(artwork, sampleUv);
}`;

/** A static image remains underneath until both textures are ready. */
export function createDepthRenderer(canvas: HTMLCanvasElement, image: HTMLImageElement, depth: HTMLImageElement) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) throw new Error('Artwork depth requires WebGL support.');
  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const dispose = () => {
    textures.forEach((texture) => gl.deleteTexture(texture));
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };
  try {
    if (!program || !buffer) throw new Error('Unable to allocate artwork depth resources.');
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertexSource],
      [gl.FRAGMENT_SHADER, fragmentSource],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Unable to allocate artwork depth shader.');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(String(gl.getShaderInfoLog(shader)));
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(String(gl.getProgramInfoLog(program)));
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    [image, depth].forEach((source, index) => {
      const texture = gl.createTexture();
      if (!texture) throw new Error('Unable to allocate artwork depth texture.');
      textures.push(texture);
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.uniform1i(gl.getUniformLocation(program, index === 0 ? 'artwork' : 'depth'), index);
    });
    gl.uniform1f(gl.getUniformLocation(program, 'aspect'), image.naturalWidth / image.naturalHeight);
    const pointer = gl.getUniformLocation(program, 'pointer');
    return {
      draw(x: number, y: number) {
        const ratio = Math.min(window.devicePixelRatio, 2);
        const width = Math.round(canvas.clientWidth * ratio);
        const height = Math.round(canvas.clientHeight * ratio);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
        gl.uniform2f(pointer, x, y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
