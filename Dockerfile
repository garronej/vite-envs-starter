
# build environment
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# production environment
FROM nginx:stable-alpine
RUN apk add --update nodejs npm
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf    
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
RUN npm i -g vite-envs@`node -e 'console.log(require("./.vite-envs.json").version)'`
ENTRYPOINT sh -c "npx vite-envs && nginx -g 'daemon off;'"