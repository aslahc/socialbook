import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from '../models/user/user';

// Extend the Request interface to include a 'user' property
declare module 'express' {
  interface Request {
    user?: IUser;
  }
}

const portectRoutes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token: string | undefined = req.cookies.jwt;

    if (!token) {
      res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
      return; // Ensure function returns void here
    }

    const decoded: JwtPayload | null = jwt.verify(token, "process.env.JWT_TOKEN") as JwtPayload;

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - No Valid Token" });
      return; // Ensure function returns void here
    }

    const userId: string = decoded.userId as string;

    const user: IUser | null = await User.findById(userId).select("-password").lean().exec() as IUser | null;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return; // Ensure function returns void here
    }

    // Assign the 'user' property to the 'req' object
    req.user = user;

    next();

    // Ensure function returns void after calling next()
    return;
  } catch (error) {
    console.log("Error from protectRoute middleware", "error.message");
    res.status(500).json({ error: "Internal server error" });
    return; // Ensure function returns void here
  }
};

export default portectRoutes;
