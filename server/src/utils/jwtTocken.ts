// import jwt from "jsonwebtoken";
// import { Response } from "express";

// const generateTokenAndSetCookie = (userId: string, res: Response) => {

    
//     const token = jwt.sign({ userId }, process.env.JWT_TOKEN as string, {
//         expiresIn: '15d',
//     });
//     console.log(token)
//     console.log("hello")

//  res.cookie("jwt", token, {
//         maxAge: 15 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: "strict",
       
//     });
//     // console.log("he",he)

// };

// // export { generateTokenAndSetCookie };
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_TOKEN as string, { expiresIn: '15d' });
};