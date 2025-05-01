FROM node:18-alpine
WORKDIR /app

# Copy shared code
COPY common ./common

# Copy service files and install
COPY service-b/package.json ./
RUN npm install
COPY service-b/index.js ./

EXPOSE 3002
CMD ["node", "index.js"]