FROM node:alpine

WORKDIR /usr/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy tsconfig and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Build the application
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]