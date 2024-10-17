import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:8080', // 默认向 8080 端口发送请求
    timeout: 5000,
})

export default request
