FROM oven/bun:1.3-slim

WORKDIR /app

RUN bun install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

COPY api/package.json ./api/
COPY turbo.json ./

RUN pnpm install --frozen-lockfile

COPY api/ ./api/

RUN pnpm --filter @workspace/api build 

EXPOSE 3000

WORKDIR /app/api

CMD ["pnpm", "start"]
