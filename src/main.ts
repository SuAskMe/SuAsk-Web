import '@arco-design/web-vue/dist/arco.css'

import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import '../mock/index.js'
import 'virtual:svg-icons-register';
import SvgIcon from "@/components/svg-icon"
import { setupRouter } from './router'

const app = createApp(App)


setupRouter(app);
app.use(ArcoVue)
app.component("svg-icon", SvgIcon)
app.mount('#app')
