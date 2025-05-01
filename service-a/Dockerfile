FROM node:18-alpine
WORKDIR /app

# Copy shared code
COPY common ./common

# Copy service files and install
COPY service-a/package.json ./
RUN npm install
COPY service-a/index.js ./

EXPOSE 3001
CMD ["node", "index.js"]