# Backend Dockerfile
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/avatars uploads/recipes

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]

