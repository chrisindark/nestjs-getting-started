FROM node:14-alpine

WORKDIR /usr/src/consumer

# RUN npm i -g corepack yarn

COPY ./package.json ./yarn.lock ./.yarnrc.yml ./
COPY ./.yarn ./.yarn

RUN yarn install

ARG NODE_ENV=$NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . .

RUN yarn run build

EXPOSE 4000

CMD ["yarn", "run", "start"]
