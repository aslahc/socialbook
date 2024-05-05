import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import User from '../models/user/user'


interface UserPayload {
  userId?: string;
  role?: string;
}

export const isBlock = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authorizationHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET as string, async (err: JsonWebTokenError | null, decoded: any) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ error: "Token expired" });
      } else {
        console.error("Failed to authenticate token:", err);
        return res.status(401).json({ error: "Failed to authenticate token" });
      }
    }

    if (!decoded || !decoded.role || !decoded.userId) {
      return res.status(400).json({ error: 'Invalid token structure or missing role/userId information' });
    }

    // Fetch user from database based on userId
    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.isBlock) { 
        return res.status(403).json({ error: 'User is blocked' });
      }

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.error("Error fetching user from database:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};
