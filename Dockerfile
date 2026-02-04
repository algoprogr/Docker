# Use official Node.js LTS image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose port (HF Spaces will provide $PORT)
ENV PORT=8080

# Run the server
CMD ["node", "index.js"]
