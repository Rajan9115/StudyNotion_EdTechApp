import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // Optional: you can set your dev server port
    open: true,        // Optional: opens browser automatically
  },
  resolve: {
    alias: {
      "@": "/src",     // Optional: allows @ as alias for src
    },
  },
});
