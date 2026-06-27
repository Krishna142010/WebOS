import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        target: 'esnext',
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-core';
                        }
                        return'vendor';
                    }
                }
            }
        }
    }
})