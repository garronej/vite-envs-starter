import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// This enables absolute imports like `import { useOidc } from "oidc";`
// instead of `import { useOidc } from "../../oidc";`
// You also need to add "baseUrl": "./src" to your tsconfig.json
import tsconfigPaths from 'vite-tsconfig-paths';
// NOTE: This is just for the Keycloakify core contributors to be able to dynamically link
// to a local version of the keycloakify package. This is not needed for normal usage.
import commonjs from 'vite-plugin-commonjs'
import { envs } from 'vite-envs/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    commonjs(), 
    envs()
  ],
  /* 
   * Uncomment this if you want to use the default domain provided by GitHub Pages
   * replace "keycloakify-starter" with your repository name.  
   * This is only relevent if you are building an Wep App + A Keycloak theme.
   * If you are only building a Keycloak theme, you can ignore this.  
   */
  //base: "/keycloakify-starter/"
})