import type { User } from "@/model/user.model";

export function getUserInfo(): User {
    const userInfo: User = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null;
    return userInfo;
}