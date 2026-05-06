FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3003
ENV PORT=3003
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
	CMD wget -qO- http://localhost:3003/health || exit 1
CMD ["node", "index.js"]