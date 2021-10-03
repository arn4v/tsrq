import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "lib/index.ts"),
			name: "tsrq",
		},
		rollupOptions: {
			external: ["react", "react-query"],
			output: {
				globals: {
					react: "React",
				},
			},
		},
	},
	plugins: [react()],
});
