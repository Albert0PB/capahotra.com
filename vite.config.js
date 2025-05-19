import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://localhost',
        },
        cors: {
            origin: ['http://capahotra.com', 'http://localhost:5173'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        },
    },
    optimizeDeps: {
        include: ['lucide-react'],
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});
