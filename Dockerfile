FROM node:18-alpine

WORKDIR /usr/src/nestjs

# RUN npm i -g corepack yarn
# Bundle APP files
RUN npm install -g pm2 pnpm

COPY ./package.json ./pnpm-lock.yaml ./
# COPY ./package.json ./yarn.lock ./.yarnrc.yml ./
# COPY ./.yarn ./.yarn

# Install app dependencies
RUN pnpm install
# RUN yarn install

ARG NODE_ENV=$NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . .

RUN pnpm build
# RUN yarn build

ARG PORT=3000
EXPOSE $PORT

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

CMD ["yarn", "run", "start"]
