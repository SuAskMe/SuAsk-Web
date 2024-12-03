import { ElMessage } from "element-plus";

function userNameCheck(userName: string): boolean {
    const regex = /^[A-Z0-9a-z_-]+$/;
    return regex.test(userName);
}

function mailCheck(mail: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(mail);
}

function verificationCodeCheck(verificationCode: string): boolean {
    const regex = /^[0-9]{6}$/;
    return regex.test(verificationCode);
}

function passwordCheck(newPassword: string, confirmPassword: string): boolean {
    if (newPassword === confirmPassword) {
        return true;
    } else {
        return false;
    }
}

export { userNameCheck, mailCheck, verificationCodeCheck, passwordCheck };