# Use official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend project
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js server
CMD ["npm", "run", "start"]
