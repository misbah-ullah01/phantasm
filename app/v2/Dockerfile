FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3002
ENV PORT=3002
ENV APP_VERSION=v2.0
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3002/health || exit 1
CMD ["node", "server.js"]