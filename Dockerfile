FROM node:lts AS builder

WORKDIR /opt/app

COPY package*.json ./
COPY src src
COPY index.js index.js

RUN npm install


CMD [ "node", "index.js" ]

# docker build -t veklohub/veklobot . 
# docker run -p host_port:port_in_docker -v `pwd`/config:/opt/app/config:ro,z -ti veklohub/veklobot:latest
