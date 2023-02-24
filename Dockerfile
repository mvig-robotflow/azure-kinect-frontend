#FROM httpd
#EXPOSE 80
#EXPOSE 443
#COPY dist /usr/local/apache2/htdocs

#FROM node:16.18.1 AS builder
#WORKDIR /opt/build
#COPY frontend /opt/build
#RUN yarn install && yarn build

FROM nginx:1.23.3
#COPY --from=builder /opt/build/dist /var/www/html/public
COPY dist /var/www/html/public

COPY manifests/nginx.conf /etc/nginx/nginx.conf
COPY manifests/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 80

SHELL ["/bin/bash", "-c"]
ENTRYPOINT ["./entrypoint.sh"]
