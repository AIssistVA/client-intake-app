# --- Build React frontend ---
FROM node:20 AS build-frontend
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# --- Build backend ---
FROM node:20 AS backend
WORKDIR /app
COPY server ./server
COPY --from=build-frontend /app/client/build ./client-build
WORKDIR /app/server
RUN npm install

# Copy .env if present
COPY server/.env ./

# Serve React build as static files
ENV CLIENT_BUILD_PATH=/app/client-build
ENV PORT=4000

# Add static serving to Express
RUN echo "\nconst express = require('express');\nconst path = process.env.CLIENT_BUILD_PATH || __dirname + '/../client-build';\napp.use(express.static(path));\napp.get('*', (req, res) => res.sendFile(path + '/index.html'));\n" >> index.js

EXPOSE 4000
CMD ["node", "index.js"]