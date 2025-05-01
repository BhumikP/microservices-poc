FROM node:18-alpine
WORKDIR /app

# Copy shared code
COPY common ./common

# Copy gateway files and install
COPY api-gateway/package.json ./
RUN npm install
COPY api-gateway/index.js ./

EXPOSE 3000
CMD ["node", "index.js"]