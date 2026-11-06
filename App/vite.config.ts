import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  envDir: path.resolve(__dirname, "../"),
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "business.seynova.ai",
      "business.ctrls.co",
      ".seynova.ai",
      ".ctrls.co",
      "localhost",
    ],
    // Disable Vite HMR WebSocket behind reverse proxies unless explicitly enabled via VITE_ENABLE_HMR=true
    hmr: process.env.VITE_ENABLE_HMR === "true" ? { overlay: false } : false,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));