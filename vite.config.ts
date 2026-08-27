import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            include: [resolve(__dirname, 'src')],
            exclude: [resolve(__dirname, 'src/tests')],
            outDir: resolve(__dirname, 'dist'),
            tsconfigPath: resolve(__dirname, 'tsconfig.json'),
            pathsToAliases: false,
        }),
    ],

    // Dev server uses demo/index.html
    root: 'demo',

    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'VueSheetMapper',
            fileName: 'vue-sheet-mapper',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['vue', 'xlsx'],
            output: {
                globals: { vue: 'Vue', xlsx: 'XLSX' },
                assetFileNames: 'style[extname]',
            },
        },
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        // publicDir resolves to demo/public: serve it, do not publish it.
        copyPublicDir: false,
    },
});
