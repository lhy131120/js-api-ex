import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

export default defineConfig({
	base: "/js-api-ex/",
	plugins: [
		tailwindcss(),
		{
			name: "move-dashboard-html",
			apply: "build",
			enforce: "post",
			writeBundle() {
				// Move dashboard.html from dist/src/pages/ to dist/
				const srcPath = path.join(process.cwd(), "dist/src/pages/dashboard.html");
				const destPath = path.join(process.cwd(), "dist/dashboard.html");
				if (fs.existsSync(srcPath)) {
					fs.copyFileSync(srcPath, destPath);
					console.log("✓ Moved dashboard.html to dist root");
				}
			},
		},
	],
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				main: "index.html",
				dashboard: "src/pages/dashboard.html",
			},
		},
	},
});