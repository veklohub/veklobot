FROM node:lts AS builder

WORKDIR /opt/app

ARG HOST=test.com
ARG EMAIL=admin@test.com
ARG BUILD_PATH_TO_CERT_KEY=./certs/server.key
ARG BUILD_PATH_TO_CERT=./certs/server.cert

ENV PATH_TO_CERT_KEY $BUILD_PATH_TO_CERT_KEY
ENV PATH_TO_CERT $BUILD_PATH_TO_CERT

COPY package*.json ./
COPY src src
COPY index.js index.js

RUN mkdir /opt/app/certs && \
    openssl req -nodes -new -x509 -keyout $PATH_TO_CERT_KEY -out $PATH_TO_CERT \
    -subj /C=UA/ST=Kyiv/L=Kyiv/O=veklohub/OU=IT/CN=$HOST/emailAddress=$EMAIL

RUN npm install

CMD [ "node", "index.js" ]

# docker build -t wzooff/veklobot . 
# docker run -p host_port:port_in_docker -v `pwd`/config:/opt/app/config:ro,z -ti wzooff/veklobot:latest
