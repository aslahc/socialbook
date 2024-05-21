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
    const token = jwt.sign(payload,process.env.JWT_SECRET!,{ expiresIn: '5h' });
    console.log(token)
  
    return token;
}
