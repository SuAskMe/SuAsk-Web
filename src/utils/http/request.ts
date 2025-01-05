import { UserStore, UserStoreWithOut } from '@/store/modules/user';
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { computed } from 'vue';

const request = axios.create({
    baseURL: 'http://localhost:8080', // 默认向 8080 端口发送请求
    timeout: 5000,
})

request.interceptors.response.use(res => {
    if (res.status === 200) {
        if (res.data.code == 0) {
            return res.data
        } else {
            // ElMessage.error(res.data.message)
            console.log("错误:\n", res.data.message);
            return null
        }
    } else {
        ElMessage.error("请求错误")
        return res.data
    }
}, error => {
    ElMessage.error("请求无响应")
    console.log("请求无响应:", error);
    return false
})

request.interceptors.request.use(
    (config) => {
        const userStore = UserStoreWithOut()
        const token = userStore.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default request
