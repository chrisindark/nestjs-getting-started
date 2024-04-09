## Installation

```
sudo apt install curl -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install v18
node -v
npm -v
npm install -g yarn
yarn global add pm2

sudo apt install nginx
sudo apt install certbot python3-certbot-nginx
sudo systemctl enable nginx

sudo certbot --nginx -d voice-tools.justcall.io
sudo systemctl status certbot.timer
sudo certbot renew --dry-run

sudo apt install supervisor
sudo apt install logrotate


```

## Locations

```
nginx: /etc/nginx/
nestjs application: /var/www/html/voice-tools/
supervisord: @TODO to be installed and setup for autostarting
```

## Copy env file and add required data

```bash
# copy env file
$ cp .env.example .env.local
$ cp .env.example .env.staging
$ cp .env.example .env.production
# edit in env file for configurations in .env file
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# staging mode
$ yarn run start:staging

# production mode
$ yarn run start:prod
```

<!-- apt install nginx -->

<!-- apt install haproxy -->

```bash
# development image build
$ docker image build -f Dockerfile.dev --tag nestjs-getting-started/local:latest --platform=linux/amd64 .

# staging image build
$ docker image build -f Dockerfile.staging --tag nestjs-getting-started/local:latest --platform=linux/amd64 .

# run for development in watch mode
$ docker run -p 3000:3000 nestjs-getting-started/local:latest

docker run --name nestjs-getting-started -i -t -p 4000:4000 nestjs-getting-started:latest

docker tag nestjs-getting-started:latest chrisindark/nestjs-getting-started:latest

docker push chrisindark/nestjs-getting-started:latest

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Nginx

sudo nginx -t
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl reload nginx

## PM2

pm2 install pm2-logrotate
pm2 config pm2-logrotate
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:retain 5

pm2 conf

pm2 monit

pm2 startup

pm2 save

# Start all applications

pm2 start ecosystem.config.js

# Stop all

pm2 stop ecosystem.config.js

# Restart all

pm2 restart ecosystem.config.js

# Reload all

pm2 reload ecosystem.config.js

# Delete all

<!-- pm2 delete ecosystem.config.js -->

# Run pm2 with specified env

pm2 restart ecosystem.config.js --env staging
pm2 restart ecosystem.config.js --env prod

## Supervisor

sudo systemctl status supervisor
sudo systemctl start supervisor
sudo systemctl stop supervisor
sudo systemctl reload supervisor
sudo supervisorctl reread
sudo supervisorctl update

## Server Disk Cleanup

check logs in pm2 folder -> /root/.pm2/logs
check logs in nginx folder -> /var/log/nginx/logs
sudo journalctl --disk-usage
sudo journalctl --vacuum-files=1

sudo apt autoremove
sudo apt autoclean
sudo apt clean

## Setup Husky

npm install husky --save-dev
npx husky install

## To check for package upgrades

npx ncu -i
