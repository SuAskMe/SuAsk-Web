import '@arco-design/web-vue/dist/arco.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import '../mock/index.js'
import 'virtual:svg-icons-register';
import SvgIcon from "@/components/svg-icon.vue"

const app = createApp(App)

app.use(router)
app.use(ArcoVue)
app.component("svg-icon", SvgIcon)

app.mount('#app')
