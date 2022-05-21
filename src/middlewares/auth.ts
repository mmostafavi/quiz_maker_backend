import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.body.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.body.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    req.body.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.body.isAuth = false;
    return next();
  }

  req.body.isAuth = true;
  req.body.userData = { ...decodedToken };
  return next();
}
