import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.error('Error:', err);

    const statusCode = res.statusCode || 500;
    res.status(statusCode).json({ message: err.message, stack: err.stack });
   
};
