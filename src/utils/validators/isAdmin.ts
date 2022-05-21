export default function (isAuth: boolean, tokenData: any, userId: string) {
  return (
    isAuth && tokenData.userId === userId && tokenData.tokenType === "admin"
  );
}
