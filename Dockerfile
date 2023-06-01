# We're running a node application, use node base image from dockerhub
FROM node:20-slim
# Install postgres
RUN apt-get update \
    && apt-get install -y postgresql \
    && rm -rf /var/lib/apt/lists/*
# Set base directory
WORKDIR /app
# Copy and install dependencies
COPY package*.json .
RUN npm ci
# Copy server folder
COPY . .
# Init DB
RUN npm run db:init
RUN npm run build
# RUN the application
CMD ["npm", "start"]
# Expose port 5001 so backend is accesible
EXPOSE 8000