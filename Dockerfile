FROM node:alpine

WORKDIR /usr/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build 

CMD ["node", "dist/index.js"]
