const saveToken = (token: string) => {
    localStorage.setItem('authToken', token)
}
const getToken = () => {
    return localStorage.getItem('authToken')
}
const removeToken = () => {
    localStorage.removeItem('authToken')
}

export { saveToken, getToken, removeToken }
