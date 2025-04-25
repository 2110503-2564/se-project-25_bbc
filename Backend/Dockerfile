# Use official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend project
COPY . .

# Expose backend port
EXPOSE 8000

# Run the backend server
CMD ["npm", "start"]
