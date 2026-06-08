import { ControlPanelStore } from '@/shared/model'
import { getDeviceId } from '@/shared/lib/device'
import axios from 'axios'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { containsChineseCharacters } from '@/shared/lib/text'
import { getRequestAuthAdapter } from './request-auth'

const ADMIN_ROLE = 'admin'

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000,
})

const returnToLogin = () => {
    setTimeout(() => {
        getRequestAuthAdapter().clearSession()
        location.href = '/login'
        ControlPanelStore().clearSelectedItem()
    }, 1000)
}

request.interceptors.response.use(
    (res) => {
        if (res.status === 200) {
            if (res.data.code == 0) {
                return res.data
            } else if (res.data.code == 401) {
                ElMessage.error('登录超时，请重新登录')
                returnToLogin()
                return null
            } else {
                const msg: string = res.data.message
                if (msg.includes('登录')) {
                    ElMessage.error(msg)
                    returnToLogin()
                } else if (containsChineseCharacters(res.data.message)) {
                    ElMessage.error(res.data.message)
                }
                return null
            }
        } else {
            ElMessage.error('请求错误')
            return null
        }
    },
    () => {
        ElMessage.error('请求无响应')
        return null
    },
)

request.interceptors.request.use(
    (config) => {
        const authAdapter = getRequestAuthAdapter()
        const token = authAdapter.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // 管理员：始终附加 X-Admin-Mode header
        if (authAdapter.getRole() === ADMIN_ROLE) {
            config.headers['X-Admin-Mode'] = 'true'
        }

        // 附加设备标识
        config.headers['X-Device-Id'] = getDeviceId()

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default request
