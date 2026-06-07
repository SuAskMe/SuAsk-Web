import { ControlPanelStore } from '@/store/modules/control-panel'
import { UserStoreWithOut } from '@/store/modules/user'
import { Role } from '@/entities/user'
import { getDeviceId } from '@/shared/lib/device'
import axios from 'axios'
import { ElMessage } from 'element-plus/es/components/message/index.mjs'
import { containsChineseCharacters } from '@/utils/ischinese'

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000,
})

const returnToLogin = () => {
    setTimeout(() => {
        UserStoreWithOut().setToken('')
        location.href = '/login'
        UserStoreWithOut().resetState()
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
            return res.data
        }
    },
    () => {
        ElMessage.error('请求无响应')
        return false
    },
)

request.interceptors.request.use(
    (config) => {
        const userStore = UserStoreWithOut()
        const token = userStore.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // 管理员：始终附加 X-Admin-Mode header
        if (userStore.getRole() === Role.ADMIN) {
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
