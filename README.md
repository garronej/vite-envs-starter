# Starter setup for [vite-envs](https://github.com/garronej/vite-envs)

This is a starter setup to demonstrate how to set up [vite-envs](https://github.com/garronej/vite-envs)
in a `Vite`/`TypeScript`/`Docker` WebApp.

## Try it

Declare the variables that your app will accept.  

`.env` (Should be added to Git, if your `.env` is gitignored [you can use another file](#env-file-gitignored))
```.env
TITLE=Default title
DESCRIPTION=
```

Set the values for your dev environment.  

`.env.local` (Should be gitignored)
```.env
TITLE=Custom title
DESCRIPTION="Custom description"
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
    <meta name="description" content="%DESCRIPTION%">

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
    --env DESCRIPTION='Description from container env' \
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
+import { viteEnvs } from 'vite-envs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
+   viteEnvs({
+     declarationFile: ".env"
+   })
  ]
})
```

`package.json`
```diff
 "scripts": {
+  "postinstall": "vite-envs update-types",
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
 COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf    
 WORKDIR /usr/share/nginx/html
 COPY --from=build /app/dist .
-ENTRYPOINT sh -c "nginx -g 'daemon off;'"
+ENTRYPOINT sh -c "./vite-envs.sh && nginx -g 'daemon off;'"
```

## `.env` file gitignored  

If you don't want to add the `.env` file to Git you can use another file
for declaring the variables names and default values.  

`vite.config.ts`
```diff
 import { defineConfig } from 'vite'
 import { viteEnvs } from 'vite-envs'
 
 // https://vitejs.dev/config/
 export default defineConfig({
   plugins: [
     viteEnvs({
+      declarationFile: ".env.declaration"
     })
   ]
 })
```

If you use another file that `.env` as your declaration files feel free to use the `.env`
file in place of the `.env.local` file.  

## EJS  

> Caveats: Enabling EJS requires to have Node available in you Docker container
> this will add an extra 20MB to your docker image size.  
> Be also aware that it won't work if you use other vite plugin that transform the `index.html`.  

For some usecases placeholder substitution like `%FOO%` in the `index.html` is not enough.  
`vite-envs` let you use EJS expressions in your `index.html` file.  
This enables you to generate different HTML based on the environment variables values.  
This is useful if you want to perform operation like the following:  

``html
<html>
  <head>
    <% const obj = JSON5.parse(import.meta.env.CUSTOM_META); %>
    <% for (const [key, value] of Object.entries(obj)) { %>
      <meta name="<%= key %>" content="<%= value %>" />
    <% } %>
</head>
```

To enable this feature:  

`vite.config.ts`
```diff
 import { defineConfig } from 'vite'
 import { viteEnvs } from 'vite-envs'

 export default defineConfig({
   plugins: [
     viteEnvs({
+      indexAsEjs: true
     })
   ]
 })
```

(OPTIONAL) If you want to have access to [`JSON5`](https://json5.org/) and/or [`YAML`](https://www.npmjs.com/package/yaml) in your EJS context.

`package.json`
```diff
 "devDependencies": {
+  "json5": "2.2.3",
+  "yaml": "2.4.0"
 }
```

`Dockerfile`
```diff
 # production environment
 FROM nginx:stable-alpine
+RUN apk add --update nodejs npm
 COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf    
 WORKDIR /usr/share/nginx/html
 COPY --from=build /app/dist .
+RUN npm i -g json5@2.2.3 
+RUN npm i -g yaml@2.4.0
+RUN npm i -g vite-envs@`node -e 'console.log(require("./.vite-envs.json").version)'`
-ENTRYPOINT sh -c "./vite-envs.sh && nginx -g 'daemon off;'"
+ENTRYPOINT sh -c "npx vite-envs && nginx -g 'daemon off;'"
```


## Publishing and deploying the Docker image of your Vite App  

There's nothing else you need to know to start using `vite-envs`, however if you're interested, 
here are some instruction that you can follow to publish your Docker image on DockerHub with GitHub Actions
and deploying the image using Railway, all for Free.  

<p align="center">
  <a href="https://www.youtube.com/watch?v=anVek3aV3O4">
    <img width="1000" alt="image" src="https://github.com/garronej/vite-envs/assets/6702424/7aa487fa-e084-4990-a15e-211f8e4fa02f">
  </a>
  <p align="center"><i>Publishing and deploying your Vite app Docker Image</i></p>
</p>

👉 [Step by step Guide](https://app.tango.us/app/workflow/Managing-GitHub-and-Docker-Settings-for-Repository-Workflow-Integration-f13fe5eae0f04985b26b1a6094e3c7eb).  
  
This starter comes with [a fully generic CI workflow](https://github.com/garronej/vite-envs/blob/main/.github/workflows/ci.yaml) that
publishes the Docker image of your Vite App of DockerHub automatically.  
You can copy past the `ci.yaml` file into your repo, there is nothing to change.  
It will publish the Docker image `<your github username>/<your vite repo name>`.  

To enable it simply create two GitHub secrets:  
 - `DOCKERHUB_USERNAME`  
 - `DOCKERHUB_TOKEN`   

To trigger the workflow just bump the version number in the `package.json` and push!  
