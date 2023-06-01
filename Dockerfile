# We're running a node application, use node base image from dockerhub
FROM node:20-slim
# Set base directory
WORKDIR /app
# Copy and install dependencies
COPY package*.json .
RUN npm ci
# Copy server folder
COPY . .
# Init DB
RUN npm run build
# RUN the application
CMD ["npm", "run", "start:prod"]
# Expose port 8000 so backend is accesible
EXPOSE 8000