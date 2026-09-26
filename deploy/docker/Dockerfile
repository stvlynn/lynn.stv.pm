# Lynn character standard — one image serving the API and the built SPA.
# Build from the repository root:  docker build -f deploy/docker/Dockerfile .

FROM node:22-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/tokens/package.json packages/tokens/
COPY packages/contracts/package.json packages/contracts/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=8787 HOST=0.0.0.0 STATIC_DIR=/app/public
WORKDIR /app
# The backend bundle inlines every dependency; package.json only marks ESM.
COPY --from=build /repo/backend/package.json ./package.json
COPY --from=build /repo/backend/dist ./dist
COPY --from=build /repo/frontend/dist ./public
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8787/health || exit 1
CMD ["node", "dist/main.js"]
