import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        // Default environment for pure utility and composable tests.
        // Component tests (parseFile, ColumnCard, SheetMapper) override this
        // per-file with: // @vitest-environment happy-dom
        environment: 'node',
        include: ['src/**/*.test.ts'],
    },
});
