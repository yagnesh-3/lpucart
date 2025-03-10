# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Ensure bcrypt is installed inside Docker
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy the rest of the backend files
COPY . .

# Expose the backend port
EXPOSE 8082

# Start the server
CMD ["npm", "start"]
