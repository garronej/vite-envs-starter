import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// NOTE: This is just for the Keycloakify core contributors to be able to dynamically link
// to a local version of the keycloakify package. This is not needed for normal usage.
import commonjs from 'vite-plugin-commonjs'
import { viteEnvs } from 'vite-envs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    commonjs(), 
    viteEnvs({
      // This is completely optional.  
      // It enables you to define environment 
      // variables that are computed at build time.
      computedEnv: async ()=> {

        const path = await import('path');
        const fs = await import('fs/promises');

        const packageJson = JSON.parse(await fs.readFile(path.resolve(__dirname, 'package.json'), 'utf-8'));

        return {
          BUILD_TIME: Date.now(),
          VERSION: packageJson.version,
        };

      }
    })
  ]
})