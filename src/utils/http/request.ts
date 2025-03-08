import { ControlPanelStore } from "@/store/modules/control-panel";
import { UserStoreWithOut } from "@/store/modules/user";
import axios from "axios";
import { ElMessage } from "element-plus";
import { containsChineseCharacters } from "../ischinese";

const request = axios.create({

    baseURL: '/api', // 默认向 8080 端口发送请求
    timeout: 5000,
});

const returnToLogin = () => {
    setTimeout(() => {
        location.href = "/login";
        setTimeout(() => {
            UserStoreWithOut().resetState();
            ControlPanelStore().clearSelectedItem();
        }, 100);
    }, 800);
};

request.interceptors.response.use(
    (res) => {
        if (res.status === 200) {
            console.log(res.data);
            if (res.data.code == 0) {
                return res.data;
            } else if (res.data.code == 401) {
                ElMessage.error("登录超时，请重新登录");
                returnToLogin();
                return null;
            } else {
                let msg: string = res.data.message;
                if (msg.includes("登录")) {
                    ElMessage.error(msg);
                    returnToLogin();
                } else if (containsChineseCharacters(res.data.message)) {
                    ElMessage.error(res.data.message);
                }
                console.log("错误:\n", res.data);
                return null;
            }
        } else {
            ElMessage.error("请求错误");
            console.log("请求错误:", res.data);
            return res.data;
        }
    },
    (error) => {
        ElMessage.error("请求无响应");
        console.log("请求无响应:", error);
        return false;
    }
);

request.interceptors.request.use(
    (config) => {
        const userStore = UserStoreWithOut();
        const token = userStore.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default request;
