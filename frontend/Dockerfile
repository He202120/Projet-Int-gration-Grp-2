FROM nginx:1.25-alpine

COPY certbot/nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt
COPY certbot/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key

apk update
apk add --no-cache nodejs npm
apk add nano
apk add --no-cache git

WORKDIR /usr/share/nginx/html

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]

