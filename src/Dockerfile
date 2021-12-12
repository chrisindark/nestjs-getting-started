FROM node:14-alpine

WORKDIR /usr/src/consumer

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm i

ARG NODE_ENV=$NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start"]
