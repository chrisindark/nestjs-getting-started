#!/bin/sh

echo "running git pull"
git pull
echo "git pull done"

echo "running yarn install"
yarn install
echo "yarn install done"

echo "running yarn build"
yarn build
echo "yarn build done"

echo "running yarn pm2-reload:prod"
yarn pm2-reload:prod
echo "yarn pm2-reload:prod done"

echo "stopping pm2 main"
pm2 stop main
echo "stopping pm2 main done"

echo "starting pm2 main"
NODE_ENV=prod pm2 start dist/main.js --name main -i 11
echo "starting pm2 main done"
