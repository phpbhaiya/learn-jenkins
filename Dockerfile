# Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose the app port
EXPOSE 6666

# Run the app
CMD ["node", "app.js"]
