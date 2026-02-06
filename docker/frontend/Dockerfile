FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

ARG VITE_API_ENDPOINT

ENV VITE_API_ENDPOINT=${VITE_API_ENDPOINT}

RUN npm run build

# Serve arquivos estáticos com nginx
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
