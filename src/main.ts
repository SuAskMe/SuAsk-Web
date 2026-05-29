import { createApp, type Component } from 'vue'
import App from './App.vue'
// import '../mock/index.js'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/svg-icon'
import { setupRouter } from './router'
import { config } from 'md-editor-v3'
import { isMobile } from './utils/device'
import { setupStore } from './store'
import { ElAutocomplete } from 'element-plus/es/components/autocomplete/index.mjs'
import { ElButton } from 'element-plus/es/components/button/index.mjs'
import { ElCard } from 'element-plus/es/components/card/index.mjs'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus/es/components/checkbox/index.mjs'
import { ElAside, ElContainer, ElHeader, ElMain } from 'element-plus/es/components/container/index.mjs'
import { ElDialog } from 'element-plus/es/components/dialog/index.mjs'
import {
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
} from 'element-plus/es/components/dropdown/index.mjs'
import { ElEmpty } from 'element-plus/es/components/empty/index.mjs'
import { ElIcon } from 'element-plus/es/components/icon/index.mjs'
import { ElImage } from 'element-plus/es/components/image/index.mjs'
import { ElInput } from 'element-plus/es/components/input/index.mjs'
import { ElLoading } from 'element-plus/es/components/loading/index.mjs'
import { ElScrollbar } from 'element-plus/es/components/scrollbar/index.mjs'
import { ElSwitch } from 'element-plus/es/components/switch/index.mjs'
import { ElTag } from 'element-plus/es/components/tag/index.mjs'
import { ElTooltip } from 'element-plus/es/components/tooltip/index.mjs'
import 'element-plus/es/components/autocomplete/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/container/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/empty/style/css'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/image/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/scrollbar/style/css'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/es/components/tag/style/css'
import 'element-plus/es/components/tooltip/style/css'
import {
    ArrowLeft,
    ChatDotRound,
    ChatLineRound,
    Close,
    Delete,
    Notification,
    Plus,
    WarningFilled,
} from '@element-plus/icons-vue'

console.info(`[SuAsk-Web] Build time: ${__APP_BUILD_TIME__}`)

config({
    markdownItConfig(md) {
        // Remember the old renderer if overridden, or proxy to the default renderer.
        const defaultRender =
            md.renderer.rules.link_open ||
            function (tokens, idx, options, env, self) {
                return self.renderToken(tokens, idx, options)
            }

        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            // Add a new `target` attribute, or replace the value of the existing one.
            tokens[idx].attrSet('target', '_blank')

            // Pass the token to the default renderer.
            return defaultRender(tokens, idx, options, env, self)
        }
    },
})

const app = createApp(App)

const deviceType = isMobile() ? 'mobile' : 'desktop'
app.provide('deviceType', deviceType)

const globalIcons: Record<string, Component> = {
    ArrowLeft,
    ChatDotRound,
    ChatLineRound,
    Close,
    Delete,
    Notification,
    Plus,
    WarningFilled,
}

const elementComponents = [
    ElAside,
    ElAutocomplete,
    ElButton,
    ElCard,
    ElCheckbox,
    ElCheckboxGroup,
    ElContainer,
    ElDialog,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElEmpty,
    ElHeader,
    ElIcon,
    ElImage,
    ElInput,
    ElMain,
    ElScrollbar,
    ElSwitch,
    ElTag,
    ElTooltip,
]

for (const [key, component] of Object.entries(globalIcons)) {
    app.component(key, component)
}

for (const component of elementComponents) {
    app.use(component)
}

setupRouter(app)
setupStore(app)
app.use(ElLoading)
app.component('svg-icon', SvgIcon)
app.mount('#app')
