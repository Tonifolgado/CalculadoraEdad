import path from 'path';
import { defineConfig, loadEnv } from 'vite';
//Vite is a tool for fast build development
// This is a configuration file for Vite

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', ''); // Load environment variables from .env file
    // This makes variables, such as your GEMINI_API_KEY, available within this configuration file.
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [],
      define: {// Define global constants to be replaced at compile time
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {// shortcut or alises for directories, @ points to the root directory
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
