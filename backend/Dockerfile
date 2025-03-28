# Use Node.js as base image
FROM node:20.12.2-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev && npm install -g ts-node

# Copy the entire project
COPY . .

# Specify the correct path for Prisma schema
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Expose ports for Express and WebSocket
EXPOSE 3005 5050

# Start the application
CMD ["npm", "run", "start"]
