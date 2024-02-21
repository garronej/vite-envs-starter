# Starter setup for [vite-envs](https://github.com/garronej/vite-envs)

> NOTE: The current version requires the inclusion of node in the NGINX docker
> image but this dependency will be removed in the next version of `vite-envs`.  

This is a starter setup to demonstrate how to set up [vite-envs](https://github.com/garronej/vite-envs)
in a `Vite`/`TypeScript`/`Docker` WebApp.

## Try it

Declare the variables that your webapp accept.  

`.env`
```.env
TITLE=Default title
CUSTOM_META=
```

Set the values for your dev environment.  

`.env.local` (This file shouldn't be added to Git)
```.env
TITLE=Custom title
CUSTOM_META='{ foo: "value1", bar: "value2", baz: "value3" }'
```

`src/main.tsx`
```ts
console.log(`The title of the page is ${import.meta.env.TITLE}`);
```

`index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <!-- ... -->

    <title>%TITLE%</title>

    <!-- JSON5 (https://json5.org/) is made available by vite-envs, 
         JSON5 is an extension to JSON that aims to be easier to write and 
         maintain by hand (e.g. for config files). 
         You can also use YAML.parse()
         -->
    <% const obj = JSON5.parse(import.meta.env.CUSTOM_META); %>
    <% for (const [key, value] of Object.entries(obj)) { %>
      <meta name="<%= key %>" content="<%= value %>" />
    <% } %>
</head>
```

Optionally, define computed variables.  

`vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteEnvs } from 'vite-envs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEnvs({
      computedEnv: async ({ resolvedConfig, env, envLocal }) => {

        const path = await import('path')
        const fs = await import('fs/promises')

        const packageJson = JSON.parse(
          await fs.readFile(
            path.resolve(__dirname, 'package.json'),
            'utf-8'
          )
        )

        // Here you can define any arbitrary values they will be available 
        // in `import.meta.env` and it's type definitions.  
        // You can also compute defaults for variable declared in `.env` files.
        return {
          BUILD_TIME: Date.now(),
          VERSION: packageJson.version
        }

      }
    })
  ]
})
```

Now, however you can do that:  

```bash
docker build -t garronej/vite-envs-starter:main .

docker run -it -p 8083:8080 \
    --env TITLE='Title from container env' \
    --env CUSTOM_META='{ foo: "value1", bar: "value2" }' \
    garronej/vite-envs-starter:main
```

Reach http://localhost:8083 🚀.  

<p align="center">
  <a href="https://www.youtube.com/watch?v=wsY7VDUIZM0">
    <img width="1000" alt="image" src="https://github.com/garronej/vite-envs/assets/6702424/9f79b37a-9cdd-40ce-be48-9475406e815d">
  </a>
  <p><i>Demo video</i></p>
</p>

## Config highlights  

Here are listed the configurations that diverges from a vanilla Vite/Docker setup.  

`package.json`
```diff
 "devDependencies": {
+    "vite-envs": "^3.5.4",
 }
```

`vite.config.ts`
```diff
 import { defineConfig } from 'vite'
 import react from '@vitejs/plugin-react'
+import { viteEnvs } from 'vite-envs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
+   viteEnvs()
  ]
})
```

`package.json`
```diff
 "scripts": {
+  "prepare": "vite-envs update-types",
   "dev": "vite",
   "build": "tsc && vite build"
 }
```
`npx vite-envs update-types` updates `src/vite-envs.d.ts` to make TypeScript aware of the 
environment variables you have declared in you `.env` file.  
This script is not strictly required it's just for a better development experience.  

`Dockerfile`
```diff
 # build environment
 FROM node:20-alpine as build
 WORKDIR /app
 COPY package.json yarn.lock .env ./
 RUN yarn install --frozen-lockfile
 COPY . .
 RUN yarn build
 
 # production environment
 FROM nginx:stable-alpine
+RUN apk add --update nodejs npm
 COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf    
 WORKDIR /usr/share/nginx/html
 COPY --from=build /app/dist .
+RUN npm i -g vite-envs@`node -e 'console.log(require("./.vite-envs.json").version)'`
-ENTRYPOINT sh -c "nginx -g 'daemon off;'"
+ENTRYPOINT sh -c "npx vite-envs && nginx -g 'daemon off;'"
```
NOTE: Rest assured that the Docker images generated do **NOT** download `vite-envs` at runtime, only at build time.  
You docker image does not requires an internet connection to start.  
