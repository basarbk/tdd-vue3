import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*', './vitest.unit.config.js'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['**/*.unit.*'],
      globals: true,
      setupFiles: ['./setupTest.js'],
      coverage: {
        enabled: false,
        provider: 'istanbul'
      }
    }
  })
)
