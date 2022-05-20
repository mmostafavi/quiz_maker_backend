import { Request } from "express";

export interface StudentSignInReq extends Request {}

export interface StudentSignUpReq extends Request {
  isAuth: boolean;
  userData: any;
}
