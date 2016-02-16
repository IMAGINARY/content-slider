# cd into the folder containing this Dockerfile and run
# $ docker run -ti --rm -v `pwd`:/content-slider:ro -p 8123:8123 content-slider
# then access http://container-ip:8123/index.php in your web browser

FROM alpine:3.3
RUN apk add --update php-cli && rm -rf /var/cache/apk/*
WORKDIR /content-slider
CMD php -S $HOSTNAME:8123 index.php
