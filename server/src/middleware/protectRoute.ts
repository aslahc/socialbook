import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface UserPayload {
  userId?: string;
  role?: string;
}

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("entering to mudleware  ")
  const authorizationHeader = req.headers['authorization'];
 console.log(authorizationHeader)
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authorizationHeader.split(' ')[1];
      console.log(token)

  jwt.verify(token, process.env.JWT_SECRET as string, (err: JsonWebTokenError | null, decoded: any) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        // Token has expired
        
        return res.status(401).json({ error: "Token expired" });
      } else {
        // Other JWT verification errors
        console.error("Failed to authenticate token:", err);
        return res.status(401).json({ error: "Failed to authenticate token" });
      }
    }

    if (!decoded || !decoded.role) {
      return res.status(400).json({ error: 'Invalid token structure or missing role information' });
    }
    console.log("token suces")

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

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