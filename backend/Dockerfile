FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json ./

RUN npm install -g pnpm && \
    pnpm install --ignore-scripts && \
    pnpm approve-builds --all && \
    pnpm rebuild

COPY prisma ./prisma/
COPY src ./src/

RUN pnpm exec prisma generate

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node src/server.js"]