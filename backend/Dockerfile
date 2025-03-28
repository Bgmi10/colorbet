# Use Node.js as base image
FROM node:20.12.2-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev && npm install -g ts-node

# Copy the entire application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose ports for Express and WebSocket
EXPOSE 3005 5050

# Start the application
CMD ["npm", "run", "start"]
