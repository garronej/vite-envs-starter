# Demo setup for [vite-envs](https://github.com/garronej/vite-envs)

This is a "hello world" app to demonstrate how to set up [vite-envs](https://github.com/garronej/vite-envs)
in a `Vite`/`TypeScript`/`Docker` WebApp.

## Try it

### In development environment

You can use `.env` and `.env.local` as you would if you weren't using `vite-envs`.  
Just, instead of using `import.meta.env.VITE_MY_VAR` use `src/env.ts`
It is automatically generated by the `vite-envs` Vite plugin, the types are inffered from your `.env` file.

Assuming you have:  

`.env`
```env
VITE_MY_TITLE=
```

```ts
// Here we use vite-tsconfig-paths to enable absolute imports, look at the vite.config.ts file.  
// Without it we would need to `import { env } from "./relative/path/to/src/env";`

import { env } from "env";

// console.log(import.meta.env.VITE_MY_TITLE);
console.log(env.MY_TITLE); // Without prefix.
```

In the `./index.html` you can use env variables as you would without vite-envs `%VITE_MY_VAR%`.  

You can solso introduce [`EJS`](https://ejs.co/) expression (like it was possible in create-react-app).  

Assuming you have:  

`.env`
```env
VITE_MY_META='{ "foo": "value1", "bar": "value2", "baz": "value3" }'
```

You can do 

`yarn dev`  

### In production environment

```bash
docker build -t garronej/vite-envs-demo-app:main .

docker run -it -p 8083:80 \
    --env MY_TITLE='Title from container env!!!' \
    --env MY_META='{ "foo": "value1!", "bar": "value2!", "baz": "value3!" }' \
    garronej/vite-envs-demo-app:main
```
Reach http://localhost:8083


## Config highlights

`package.json`
```diff
 "dependencies": {
+   "vite-envs": "^2.0.0",
 },
 "devDependencies": {
+   "vite-tsconfig-paths": "^4.3.1"
 }
```

`tsconfig.json`
```diff
 {
   "compilerOptions": {
+    "baseUrl": "./src",
```

`.gitignore`
```ini
/src/env.ts
```

`Dockerfile`
```dockerfile
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
RUN npm i -g vite-envs@`node -e 'console.log(require("./.vite-envs.json").version)'`
ENTRYPOINT sh -c "npx vite-envs && nginx -g 'daemon off;'"
```
NOTE: Rest assured that the Docker images generated do **NOT** download `vite-envs` at runtime, only at build time.  
You docker image does not requires an internet connection to start.  
