// eslint-disable-next-line no-unused-vars
declare namespace Express {
  // eslint-disable-next-line no-unused-vars
  interface Request {
    isAuth?: boolean;
    userData?: any;
  }
}
