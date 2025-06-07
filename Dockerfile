# Dockerfile untuk mutasi-qris.id (Node.js)
FROM node:20-slim
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "fetch-qris.js"]
