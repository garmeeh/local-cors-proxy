FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN chmod +x ./bin/lcp.js
RUN npm i

EXPOSE 8010/tcp

ENTRYPOINT [ "./bin/lcp.js" ]
