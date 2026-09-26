import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

/** Forbid importing any of `layers` from inside the current one. */
const restrictLayers = (layers, message) => ({
  regex: `^(${layers.join('|')})(/|$)`,
  message,
});

/** Slices are consumed only through their public `index.ts`. */
const publicApiOnly = {
  regex: `^(${LAYERS.join('|')})/[^/]+/.+`,
  message: 'Import a slice through its public API (index.ts), not its internals.',
};

const fsdLayer = (layer, lower, sameLayerIsolated) => ({
  files: [`frontend/src/${layer}/**/*.{ts,tsx}`],
  ignores: ['frontend/src/shared/ui/beui/**'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          publicApiOnly,
          restrictLayers(
            LAYERS.filter((candidate) => !lower.includes(candidate) && (candidate !== layer || sameLayerIsolated)),
            `FSD: \`${layer}\` may import only from ${lower.join(', ') || 'itself'}.`,
          ),
        ],
      },
    ],
  },
});

const dddLayer = (layer, forbidden, frameworks = []) => ({
  files: [`backend/src/${layer}/**/*.ts`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: `(^|/)(${forbidden.join('|')})(/|$)`,
            message: `DDD: \`${layer}\` must not depend on ${forbidden.join(', ')}.`,
          },
          ...frameworks.map((name) => ({
            regex: `^${name}`,
            message: `DDD: \`${layer}\` stays framework-free.`,
          })),
        ],
      },
    ],
  },
});

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '.claude/**',
      '.agents/**',
      'frontend/src/shared/ui/beui/**',
      'frontend/scripts/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  fsdLayer('app', ['pages', 'widgets', 'features', 'entities', 'shared'], false),
  fsdLayer('pages', ['widgets', 'features', 'entities', 'shared'], true),
  fsdLayer('widgets', ['features', 'entities', 'shared'], true),
  fsdLayer('features', ['entities', 'shared'], true),
  fsdLayer('entities', ['shared'], true),
  fsdLayer('shared', [], false),
  dddLayer('domain', ['application', 'infrastructure', 'interfaces'], ['hono', '@hono', 'zod', '@lynn/']),
  dddLayer('application', ['infrastructure', 'interfaces'], ['hono', '@hono', 'zod']),
  dddLayer('infrastructure', ['interfaces'], ['hono', '@hono']),
);
