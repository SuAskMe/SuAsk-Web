function userNameCheck(userName: string): boolean {
    const regex = /^[A-Z0-9a-z_-]+$/
    return regex.test(userName)
}

function mailCheck(mail: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return regex.test(mail)
}

function passwordCheck(newPassword: string, confirmPassword: string): boolean {
    if (newPassword.trim() == confirmPassword.trim()) {
        return true
    } else {
        return false
    }
}

export { userNameCheck, mailCheck, passwordCheck }
