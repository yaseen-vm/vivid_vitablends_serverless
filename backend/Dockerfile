FROM node:20-alpine

RUN apk add --no-cache openssl curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 5000

CMD npx prisma migrate deploy && npm start
