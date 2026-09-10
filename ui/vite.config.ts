import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { reactDevtools } from "agent-react-devtools/vite"

const API_PORT = process.env.API_PORT ?? "8080"

export default defineConfig({
  plugins: [reactDevtools(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // Dev parity with the nginx prod setup: same-origin /api calls
  // are proxied to the backend, so VITE_API_URL stays empty locally.
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
  // vitest config — cast to avoid vite/vitest type mismatch
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
} as unknown as import("vite").UserConfig)
