
FROM node:20-alpine AS web-build
WORKDIR /app
COPY web/package*.json ./web/
RUN cd web && npm ci
COPY web ./web
RUN cd web && npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY api-gateway/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/web/dist/ /usr/share/nginx/html/
EXPOSE 80
