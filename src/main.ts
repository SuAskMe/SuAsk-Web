import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/main.scss'
// import '../mock/index.js'
import 'virtual:svg-icons-register'
import SvgIcon from '@/shared/ui/svg-icon'
import { setupRouter } from '@/app/router'
import { setupRequestAuth } from '@/app/providers'
import { isMobile } from '@/shared/lib/device'
import { setupStore } from '@/shared/model'
import { ElAutocomplete } from 'element-plus/es/components/autocomplete/index.mjs'
import { ElButton } from 'element-plus/es/components/button/index.mjs'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus/es/components/checkbox/index.mjs'
import {
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
} from 'element-plus/es/components/dropdown/index.mjs'
import { ElIcon } from 'element-plus/es/components/icon/index.mjs'
import { ElInput } from 'element-plus/es/components/input/index.mjs'
import { ElLoading } from 'element-plus/es/components/loading/index.mjs'
import { ElScrollbar } from 'element-plus/es/components/scrollbar/index.mjs'
import { ElTooltip } from 'element-plus/es/components/tooltip/index.mjs'
import 'element-plus/es/components/autocomplete/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/checkbox/style/css'
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/scrollbar/style/css'
import 'element-plus/es/components/tooltip/style/css'
console.info(`[SuAsk-Web] Build time: ${__APP_BUILD_TIME__}`)

const app = createApp(App)

const deviceType = isMobile() ? 'mobile' : 'desktop'
app.provide('deviceType', deviceType)

const elementComponents = [
    ElAutocomplete,
    ElButton,
    ElCheckbox,
    ElCheckboxGroup,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElIcon,
    ElInput,
    ElScrollbar,
    ElTooltip,
]

for (const component of elementComponents) {
    app.use(component)
}

setupStore(app)
setupRequestAuth()
setupRouter(app)
app.use(ElLoading)
app.component('svg-icon', SvgIcon)
app.mount('#app')
