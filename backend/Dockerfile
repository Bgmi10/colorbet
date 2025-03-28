# Use official Node.js image
ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine

# Set production environment
ENV NODE_ENV production

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Install ts-node and nodemon globally
RUN npm install -g ts-node nodemon

# Copy the entire project
COPY . .

# Use non-root user
USER node

# Expose ports for Node.js (3005) and WebSocket (5050)
EXPOSE 3005 5050

# Start the application
CMD ["npm", "start"]
