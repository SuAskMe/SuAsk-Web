import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type UserConfig } from 'vitest/config'

type VitestPlugin = NonNullable<UserConfig['plugins']>[number]

export default defineConfig({
    plugins: [vue() as unknown as VitestPlugin],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                additionalData: `@use "@/styles/global.scss" as *;`,
            },
        },
    },
    test: {
        environment: 'node',
        globals: true,
        restoreMocks: true,
        include: ['tests/**/*.test.ts'],
    },
})
