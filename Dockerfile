FROM nginx:alpine-slim
COPY dst/* /usr/share/nginx/html/
