import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "./server/ssl/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "./server/ssl/cert.pem")),
    },
  },
});
