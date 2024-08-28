FROM node:16 as base

# Port
EXPOSE 8080
WORKDIR /src

# Use the latest version of npm 
RUN npm install -g npm@latest
COPY package*.json /

FROM base as prod
RUN npm install -g ts-node
RUN npm install --no-optional && npm cache clean --force
COPY . .
CMD [ "ts-node","src/index.ts" ]

FROM base as dev
RUN npm install --no-optional && npm cache clean --force
COPY . .
CMD ["npm","run","dev"]