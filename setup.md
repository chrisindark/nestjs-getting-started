###

yarn install

###

yarn run start:dev

yarn run build
yarn start

<!-- apt install nginx -->

<!-- apt install haproxy -->

docker build --no-cache --platform=linux/amd64 -t nestjs-getting-started -f Dockerfile . --build-arg NODE_ENV=development

docker run --name nestjs-getting-started -i -t -p 4000:4000 nestjs-getting-started:latest

docker tag nestjs-getting-started:latest chrisindark/nestjs-getting-started:latest

docker push chrisindark/nestjs-getting-started:latest
