import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
	base: "/js-api-ex/",
	plugins: [tailwindcss()],
	// Explicitly set output dir to 'dist' to match the deploy script (gh-pages -d dist)
	build: {
		outDir: "dist",
	},
});