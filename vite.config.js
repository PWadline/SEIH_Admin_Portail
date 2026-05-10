// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',         // 🔥 Permet l'accès depuis d'autres appareils
    port: 5178,              // ✅ Port de Vite
    proxy: {
      "/api": {
        target: "http://localhost:5258",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});



