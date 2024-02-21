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

      // Uncomment the following line to if your `.env` file is gitignored.
      // declarationFile: '.env.declaration',
      
      // This is completely optional.  
      // It enables you to define environment 
      // variables that are computed at build time.
      computedEnv: async ({ resolvedConfig, /*declaredEnv, localEnv*/ }) => {

        const path = await import('path');
        const fs = await import('fs/promises');

        const packageJson = JSON.parse(
          await fs.readFile(
            path.join(resolvedConfig.root, 'package.json'),
            'utf-8'
          )
        );

        // Here you can define any arbitrary value they will be available 
        // in `import.meta.env` and it's type definitions.  
        // You can also compute defaults for variable declared in `.env` files.
        return {
          BUILD_TIME: Date.now(),
          VERSION: packageJson.version
        };

      }
    })
  ]
})