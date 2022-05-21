export default function (isAuth: boolean, tokenData: any, username: string) {
  return (
    isAuth && tokenData.username === username && tokenData.userType === "admin"
  );
}
