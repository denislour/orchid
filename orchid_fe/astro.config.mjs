import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const DEV_PORT = 3000;

// https://astro.build/config
export default defineConfig({
	site: process.env.CI
		? 'https://orchid-dashboard.com'
		: `http://localhost:${DEV_PORT}`,
	base: process.env.CI ? '/orchid/orchid_fe' : undefined,

	// output: 'server',

	/* Like Vercel, Netlify,… Mimicking for dev. server */
	// trailingSlash: 'always',

	server: {
		/* Dev. server only */
		port: DEV_PORT,
	},

	integrations: [
		//
		sitemap(),
		tailwind(),
	],

	markdown: {
		shikiConfig: {
			theme: 'github-light',
			wrap: true,
		},
	},

	vite: {
		resolve: {
			alias: {
				'@': new URL('./src', import.meta.url).pathname,
			},
		},
		build: {
			rollupOptions: {
				external: ['shiki/themes/hc_light.json'],
				output: {
					manualChunks: {
						// Split vendor libraries into separate chunks
						vendor: ['@faker-js/faker', 'apexcharts'],
						// Split UI libraries
						ui: ['flowbite', 'flowbite-typography'],
					},
				},
			},
			// Increase chunk size warning limit to 3000KB to accommodate large chunks
			chunkSizeWarningLimit: 3000,
		},
	},
});
