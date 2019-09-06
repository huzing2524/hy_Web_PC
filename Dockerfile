FROM node:8.9.4-alpine as builder

WORKDIR /app
COPY package*.json /app/

RUN npm install --quiet

COPY . /app/

RUN npm run build

FROM nginx:1.13.9-alpine
MAINTAINER Builder <builder@dasudian.com>

ENV RUN_ENV="prod"

RUN set -x \
  && apk update \
  && rm -f /etc/nginx/conf.d/default.conf \
  && mkdir -p /usr/share/nginx/html

COPY --from=builder /app/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
