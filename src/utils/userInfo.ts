import type { User } from "@/model/user.model";

export function getUserInfo(): User {
    const userInfo: User = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null;
    return userInfo;
}

export function setUserInfo(userInfo: User): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

export function removeUserInfo(): void {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
}