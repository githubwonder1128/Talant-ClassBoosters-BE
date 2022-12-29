FROM --platform=linux/amd64 node:16.14.0

RUN npm i -g npm@latest

RUN npm i -g pm2 && pm2 update

USER root

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY --chown=node:node . .

EXPOSE 5000

CMD ["npm", "run", "start"]