import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    root: 'demo',
    base: '/vue-sheet-mapper/',
    build: {
        outDir: resolve(__dirname, 'demo-dist'),
        emptyOutDir: true,
    },
});
