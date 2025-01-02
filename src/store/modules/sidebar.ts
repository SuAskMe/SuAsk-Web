import type { User } from "@/model/user.model";
import { getUserInfo, setUserInfo } from "@/utils/userInfo";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const UserInfoStore = defineStore('user-info', () => {
    const storedUserInfo: User = getUserInfo()
    const userInfo = ref<User>(storedUserInfo)

    function changeUserInfo(user: User) {
        userInfo.value = user
    }

    watch(userInfo, (newUserInfo) => {
        setUserInfo(newUserInfo)
    })

    return { userInfo, changeUserInfo }
})