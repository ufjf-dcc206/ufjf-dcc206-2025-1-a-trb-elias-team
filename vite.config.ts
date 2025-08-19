/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/ufjf-dcc206-2025-1-a-trb-elias-team/',
  test: {
    // ambiente de teste (jsdom simula um navegador)
    environment: 'jsdom',
    // para ter acesso aos 'globals' (describe, test, expect) sem precisar importar
    globals: true, 
  },
})