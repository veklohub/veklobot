FROM node:lts

WORKDIR /opt/app

COPY package*.json ./
COPY src src
COPY index.js index.js

ENV NODE_ENV production
RUN npm install

CMD [ "node", "index.js" ]
