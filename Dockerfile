
# build environment
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf    
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
ENTRYPOINT sh -c "./vite-envs.sh && nginx -g 'daemon off;'"