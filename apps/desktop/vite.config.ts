import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../../packages/shared/src', import.meta.url)),
      '@ui': fileURLToPath(new URL('../../packages/shared/src/ui', import.meta.url)),
      '@core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      '@infrastructure': fileURLToPath(
        new URL('../../packages/infrastructure/src', import.meta.url),
      ),
      '@features': fileURLToPath(new URL('../../packages/features/src', import.meta.url)),
      '@ai': fileURLToPath(new URL('../../packages/ai/src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
