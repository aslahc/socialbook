import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId?: string,
  role?: string
}

declare module 'express' {
    interface Request {
      user?: UserPayload; 
    }
  }

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];
console.log("Chceking");

  if (!authorizationHeader) {
    res.status(400)
    throw new Error("No token provided");
  }

  const token = authorizationHeader.split(' ')[1];  
  jwt.verify(token, process.env.JWT_SECRET as string, (err:any, decoded:any) => {
    

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.status(401); 
      throw new Error('Token expired');
    }
    if (err) {
      console.log(err);
        res.status(400);
        throw new Error("Failed to authenticate token");
    }
    
    if (!decoded || !decoded.role) {
        res.status(400);
        throw new Error('Invalid token structure or missing role information' );
    }

    req.user = decoded;
    next();
  });
};


// authorizeRole middleware
export const authorizeRole = (requiredRole:string) => (req:Request, res:Response, next:NextFunction) => {
  if (!req.user || !req.user.role || !req.user.role.includes(requiredRole)) {
        res.status(400);
        throw new Error('Insufficient permissions to access this resource');
  }
  
  next();
};