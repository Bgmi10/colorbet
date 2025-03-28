# Use official Node.js image
ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine

# Set production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies (including ts-node)
RUN npm install --omit=dev && npm install -g ts-node

# Copy the entire project
COPY . .

# Use non-root user
USER node

# Expose ports
EXPOSE 3005 5050

# Start the application
CMD ["sh", "-c", "npx prisma generate && npm start"]

