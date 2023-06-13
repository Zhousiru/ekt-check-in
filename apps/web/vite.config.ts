import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@ekt-check-in",
        replacement: fileURLToPath(new URL("../../packages", import.meta.url)),
      },
    ],
  },
});
