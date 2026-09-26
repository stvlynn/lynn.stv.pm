const still = (seconds: number, caption: string, alt: string) => ({
  id: `still-${String(seconds).padStart(3, '0')}`,
  atSeconds: seconds,
  caption,
  image: { src: `/media/pv/still-${String(seconds).padStart(3, '0')}.webp`, width: 1280, height: 720, alt },
});

export const pvGuideContent = {
  title: 'Trick Heart',
  titleNative: 'トリックハート',
  credit:
    'A Lynn cover of the original “Trick Heart” music video (music: MIMI). The original edit, backgrounds, lyrics and audio are retained.',
  summary:
    'Both human roles of the original video are recast as Lynn — a magician and her audience — while every cut, prop, animal and lyric card stays where the source put it.',
  format: {
    width: 1920,
    height: 1080,
    fps: 24,
    durationSeconds: 157,
    frames: 3768,
    audio: 'Original AAC stream, copied byte-for-byte',
  },
  identityLock: [
    'Silver-white chin-length bob',
    'Cyan inner tips',
    'Blue eyes',
    'Thin round glasses',
    'Two side hair clips',
    'Blue ribbon',
  ],
  costumes: [
    {
      id: 'costume-a',
      role: 'A · Magician',
      garments: [
        'Black diamond-patterned top hat, cyan band',
        'Deep navy tailcoat, cyan cuffs and bow tie',
        'White shirt and gloves',
        'Black shorts, asymmetric black-and-white stockings',
        'Navy ankle boots',
      ],
    },
    {
      id: 'costume-b',
      role: 'B · Everyday',
      garments: [
        'Black beret',
        'White long-sleeved sailor blouse, cyan bow',
        'Navy pleated skirt, two silver orbit clasps',
        'White ankle socks, black loafers',
      ],
    },
  ],
  costumeSheet: {
    src: '/media/pv/costume-lock.webp',
    width: 1599,
    height: 900,
    alt: 'Costume lock frame: Lynn as the magician leaning forward beside Lynn in the beret uniform sitting on the floor.',
  },
  rules: [
    {
      id: 'two-costumes',
      title: 'Two costumes, no more',
      body: 'Every shot uses costume A or B from the lock frame. The magician’s hoodie in the source ending is redrawn as costume A.',
      verdict: 'do',
    },
    {
      id: 'preserve-edit',
      title: 'Preserve the edit',
      body: 'Composition, screen position, scale, gaze and cut timing follow the source frame. Backgrounds, animals, props and lyric cards are not redrawn.',
      verdict: 'do',
    },
    {
      id: 'match-line',
      title: 'Match the source linework',
      body: 'Flat 2D anime line and fill, same weight as the original. No painted rendering, no gradients.',
      verdict: 'do',
    },
    {
      id: 'closed-eyes',
      title: 'Keep closed eyes closed',
      body: 'Expressions follow the source drawing, including blinks and squeezed-shut smiles.',
      verdict: 'do',
    },
    {
      id: 'no-warp',
      title: 'Don’t warp a pose into another pose',
      body: 'Large pose changes get a new key drawing. Optical flow is only for small motion within the same pose.',
      verdict: 'dont',
    },
    {
      id: 'no-invented-faces',
      title: 'Don’t invent a face',
      body: 'When only hands, feet or a back are visible, recolor the garments to the locked costume and leave it there.',
      verdict: 'dont',
    },
    {
      id: 'foreground',
      title: 'Restore the foreground',
      body: 'Lyrics, frame borders, particles, wind lines and flashes that sit above the characters are restored from the source after compositing.',
      verdict: 'note',
    },
  ],
  pipeline: [
    {
      id: 'audit',
      title: 'Timeline audit',
      body: 'Detect cuts and list every shot that shows a person. The result is a timeline of composite layers keyed to source frames.',
    },
    {
      id: 'key-drawings',
      title: 'Key drawings',
      body: 'For each pose, draw Lynn from three references: the source frame, the identity sheet and the costume lock frame.',
    },
    {
      id: 'composite',
      title: 'Track and composite',
      body: 'Place drawings with per-shot anchors, erase the original hair and skin by color regions, and hold static cameras still.',
    },
    {
      id: 'restore',
      title: 'Restore overlays',
      body: 'Bring back strings, lyric strokes, curtains and frame lines above the new drawings so every edge matches the source.',
    },
    {
      id: 'verify',
      title: 'Verify delivery',
      body: 'Decode all frames, check format and frame count, confirm the audio bytes match, and review per-second contact sheets.',
    },
  ],
  stills: [
    still(
      12,
      'Costume lock in context: magician and audience.',
      'Magician Lynn gesturing toward seated Lynn on a red stage with vertical lyric cards.',
    ),
    still(
      31,
      'Letterbox shot. The band edges follow the source jitter.',
      'A close-up of Lynn’s surprised eyes inside a hand-drawn horizontal band.',
    ),
    still(
      47,
      'Close-up with the source frame border restored.',
      'Lynn in the beret laughing with her eyes shut inside a cream frame.',
    ),
    still(
      62,
      'Sleeve detail: navy cuff, cyan turn-back.',
      'Magician Lynn with eyes closed pouring from a yellow cup, lyrics drawn beside her.',
    ),
    still(
      108,
      'Juggling shot, redrawn as full-body key drawings.',
      'Magician Lynn with eyes closed holding two yellow balls, credit text on the left.',
    ),
    still(
      141,
      'Sofa scene. The bird and dog are the source animals.',
      'Lynn lying on a grey sofa with a bird on her beret and a dog asleep on the floor.',
    ),
  ],
  excerpt: { src: '/media/pv/excerpt.mp4', poster: '/media/pv/excerpt-poster.webp' },
} as const;
