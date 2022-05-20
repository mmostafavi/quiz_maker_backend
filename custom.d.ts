// eslint-disable-next-line no-unused-vars
declare namespace Express {
  export interface Request {
    isAuth?: boolean;
    userData?: any;
  }
}
