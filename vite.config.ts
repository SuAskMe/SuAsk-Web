import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

function getPackageName(id: string) {
    const normalizedId = id.replace(/\\/g, '/')
    const packagePath = normalizedId.split('/node_modules/')[1]
    if (!packagePath) {
        return ''
    }
    const parts = packagePath.split('/')
    return parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
}

function chunkNameForPackage(packageName: string) {
    return packageName.replace('@', '').replace('/', '-')
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
    const shanghaiBuildTime = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })
        .format(new Date())
        .replace(' ', 'T') + '+08:00'

    const buildTime =
        command === 'build' ? shanghaiBuildTime : 'development (build time updates on npm run build)'

    return {
        define: {
            __APP_BUILD_TIME__: JSON.stringify(buildTime),
        },
        plugins: [
            vue(),
            vueDevTools(),
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                symbolId: 'icon-[name]',
            }),
        ],
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
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            const packageName = getPackageName(id)
                            if (packageName === '@codemirror/lint') {
                                return
                            }
                            if (packageName.startsWith('@codemirror/')) {
                                return chunkNameForPackage(packageName)
                            }
                            if (packageName.startsWith('@lezer/')) {
                                return chunkNameForPackage(packageName)
                            }
                            if (packageName.startsWith('markdown-it-')) {
                                return 'markdown-it-plugins'
                            }
                            if (
                                [
                                    'dexie',
                                    'element-plus',
                                    'markdown-it',
                                    'md-editor-v3',
                                    'vue-cropper',
                                ].includes(packageName)
                            ) {
                                return chunkNameForPackage(packageName)
                            }
                        }
                    },
                },
            },
            chunkSizeWarningLimit: 500,
        },
    }
})
