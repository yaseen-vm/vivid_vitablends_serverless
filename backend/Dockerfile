FROM node:20-alpine


RUN apk update && \
    apk upgrade tar && \
    apk add --no-cache openssl curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs prisma ./prisma/

RUN npm ci --only=production && \
    npx prisma generate

COPY --chown=nodejs:nodejs . .

COPY --chown=nodejs:nodejs entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nodejs
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["./entrypoint.sh"]
