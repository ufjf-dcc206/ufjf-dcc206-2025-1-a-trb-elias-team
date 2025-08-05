/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // ambiente de teste (jsdom simula um navegador)
    environment: 'jsdom',
    // para ter acesso aos 'globals' (describe, test, expect) sem precisar importar
    globals: true, 
  },
})