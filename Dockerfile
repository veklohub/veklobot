FROM node:lts

WORKDIR /opt/app

COPY package*.json ./
COPY src src
COPY index.js index.js

RUN npm install

CMD [ "node", "index.js" ]
