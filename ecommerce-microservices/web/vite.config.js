
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	build: { outDir: "dist" },
	server: {
		proxy: {
			"/api/seller": {
				target: "http://localhost:4001",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/seller/, "/api")
			},
			"/api/buyer": {
				target: "http://localhost:4002",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/buyer/, "/api")
			}
		}
	}
});
