/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev/preview ports use 42xx — "42" is the recurring HUD number in the
// Dinnaga design system (PING 42ms, SIGNAL 042) and avoids common ports.
export default defineConfig({
  plugins: [react()],
  server: { port: 4242 },
  preview: { port: 4243 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: ['**/node_modules/**', '**/tests/e2e/**', '**/dist/**'],
  },
});
