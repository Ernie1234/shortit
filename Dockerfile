# FROM node:16 as base

# # Port
# EXPOSE 8080
# WORKDIR /src

# # Use the latest version of npm 
# RUN npm install -g npm@latest
# COPY package*.json /

# FROM base as prod
# RUN npm install -g ts-node
# RUN npm install --no-optional && npm cache clean --force
# COPY . .
# CMD [ "ts-node","src/index.ts" ]

# FROM base as dev
# RUN npm install --no-optional && npm cache clean --force
# COPY . .
# CMD ["npm","run","dev"]

# Use the latest version of Node.js
FROM node:latest AS base

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the latest version of npm
RUN npm install -g npm@latest

# Production stage
FROM base AS prod
# Install ts-node and production dependencies
RUN npm install -g ts-node && \
    npm ci --only=production && \
    npm cache clean --force

# Copy the application code
COPY . .

# Command to run the application
CMD ["ts-node", "src/index.ts"]

# Development stage
FROM base AS dev
# Install development dependencies
RUN npm install && npm cache clean --force

# Copy the application code
COPY . .

# Command to run in development mode
CMD ["npm", "run", "dev"]