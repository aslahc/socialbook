import jwt from "jsonwebtoken"

export interface UserPayload {
    userId: string;
    role: string;
  }

export const generateToken = (userId:any,role:string)=>{
    const stringUserId = userId.toString();
    const payload:UserPayload = {
        userId:stringUserId,
        role
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET as string,{ expiresIn: '5h' });
    console.log(token)
  
    return token;
}










// // export { generateTokenAndSetCookie };
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

// export const generateToken = (userId: string): string => {
//     return jwt.sign({ userId }, process.env.JWT_TOKEN as string, { expiresIn: '15d' });
// };