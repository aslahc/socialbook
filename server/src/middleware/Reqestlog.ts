// requestLogger.js
import { Request, Response, NextFunction } from "express";

export const requestLogger = (req:Request, res:Response, next:any) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
  };
  

  