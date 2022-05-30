export default function (isAuth: boolean, tokenData: any) {
  return isAuth && tokenData.userType === "student";
}
