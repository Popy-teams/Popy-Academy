FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat python3 make g++

COPY package.json pnpm-lock.yaml* .npmrc ./
RUN corepack enable \
  && corepack prepare pnpm@9.15.9 --activate \
  && pnpm install --no-frozen-lockfile

COPY prisma ./prisma
RUN pnpm prisma:generate

COPY tsconfig.json tsconfig.build.json vitest.config.ts ./
COPY src ./src
COPY tests ./tests

EXPOSE 5001

CMD ["sh", "-c", "pnpm prisma migrate deploy && if [ \"$RUN_SEED\" != \"false\" ]; then pnpm prisma:seed; fi && pnpm exec tsx src/index.ts"]
