export function getAuthTokenFromLS() {
    return sessionStorage.getItem("accessToken");
}
export function getLogoutConfirmSession() {
    return sessionStorage.getItem("isLogout");
}
export function setLogoutConfirmSession(val: string) {
    return sessionStorage.setItem("isLogout", val);
}
export function setAccessTokenInLS(token: string) {
    sessionStorage.setItem("accessToken", token);
  }