FROM nginx:latest

LABEL "maintainer"="johncmunson91@gmail.com"

WORKDIR /etc/nginx

RUN rm conf.d/default.conf

COPY . .

CMD [ "sh", "run_nginx.sh" ]
