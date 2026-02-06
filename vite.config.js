import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/client",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src", "client", "index.html"),
        details: resolve(__dirname, "src", "client", "details.html"),
        filmes: resolve(__dirname, "src", "client", "filmes.html"),
        series: resolve(__dirname, "src", "client", "series.html"),
        register: resolve(__dirname, "src", "client", "register.html"),
        login: resolve(__dirname, "src", "client", "login.html"),
      },
    },
  },
});
