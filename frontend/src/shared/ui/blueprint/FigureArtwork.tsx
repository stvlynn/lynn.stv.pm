import { motion } from 'motion/react';
import { useId, useState } from 'react';
import { duration, ease } from '../../lib';
import type { FigureGeometry } from './figure';
import styles from './FigureDrawing.module.css';

export function FigureArtwork({ figure, colored }: { readonly figure: FigureGeometry; readonly colored: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const silhouetteId = `figure-silhouette-${useId().replace(/:/g, '')}`;
  const image = colored ? figure.colorImage : undefined;
  const transition = { duration: duration.base, ease: ease.out };
  return (
    <>
      <motion.g animate={{ opacity: image && loaded ? 0 : 1 }} transition={transition}>
        <g className={styles.lineart}>
          {figure.paths.map((path, index) => (
            <path key={index} d={path} />
          ))}
        </g>
        <g className={styles.glasses}>
          {figure.glasses.map((path) => (
            <path key={path} d={path} />
          ))}
        </g>
      </motion.g>
      {image ? (
        <>
          <defs>
            <clipPath id={silhouetteId}>
              {/* Potrace places each outer contour before its interior linework holes. */}
              {figure.paths.map((path, index) => (
                <path key={index} d={path.slice(0, path.indexOf('Z') + 1)} />
              ))}
              {figure.silhouetteExtras?.map((path) => (
                <path key={path} d={path} />
              ))}
            </clipPath>
          </defs>
          <motion.image
            clipPath={`url(#${silhouetteId})`}
            href={image.src}
            x={image.x}
            y={image.y}
            width={image.width}
            height={image.height}
            preserveAspectRatio="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={transition}
            onLoad={() => setLoaded(true)}
            onError={() => console.error(`Unable to load colored figure: ${image.src}`)}
          />
        </>
      ) : null}
    </>
  );
}
