import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { UserRepository } from '../repositories/UserRepository';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();
import { generateToken } from '../utils/jwtTocken'

declare module 'express-session' {
  interface Session {
    userDetails?: {
      username: string;
      email: string;
      password: string;
      phone: string;
    };
  }
}
dotenv.config();

import User, { IUser } from '../models/user/user';
import user from '../models/user/user';

const userRepository = new UserRepository();



// user signup controller 

export const signUp = async (req: Request, res: Response): Promise<void> => {


  const { username, email, password, phone } = req.body;

  try {
    const existUsername = await userRepository.usernameExists(username);

    if (existUsername) {
      console.log("enter to the existuser")
      res.status(400).json({ error: "Username already exists" });

    }

    const emailExists = await userRepository.emailExists(email);

    if (emailExists) {
      console.log("enter to the existuser")
      res.status(400).json({ error: "email is exist" });

    }
    let session = req.session;

    // You should set userDetails object with proper keys and values
    session.userDetails = {
      username: username,
      email: email,
      password: password,
      phone: phone,
    };
    const userData = req.session.userDetails;
    res.status(200).json({ success: true, userData });
    await emailVerification(email);



    // Additional logic or response handling here
  } catch (error) {
    console.error("Error:", error);
    // Handle the error or send an appropriate response
  }
}



// nodemailer code for otp 
let otpVal: string;
export const emailVerification = async (email: string): Promise<void> => {
  try {

    otpVal = Math.floor(Math.random() * 10000).toString();
    console.log(otpVal)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification Code",
      text: otpVal,
    };
    let info = await transporter.sendMail(mailOptions);

  } catch {

  }
}

// verify the otp 

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, userData } = req.body;

    if (otp !== otpVal) {
      res.status(400).json({ success: false, message: "Incorrect OTP" });
      return;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone
    });

    const savedUser = await userRepository.saveUser(newUser);
    const user = await userRepository.findByUserDetails(userData.username);

    if (user) {
      const token = generateToken(user.id);
      res.status(200).json({ success: true, message: "User registered successfully", userData: user, token });
    } else {
      res.status(404).json({ success: false, message: "User not found after registration" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// verify the login 

export const verifyLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await userRepository.findByUsername(username);
    if (!user) {
      console.log("User not found for username:", username);
      res.status(404).json({ error: "User not found" });
      return;
    } 

    const passwordMatch = await userRepository.comparePasswords(password, user.password);
    if (!passwordMatch) {
      console.log("Incorrect password for user:", username);
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    const token = generateToken(user.id); // Assuming generateToken function is defined correctly
    const { password: _, ...userData } = user; // Remove password before sending user data in response

    console.log("User logged in successfully:", username);
    res.status(200).json({ success: true, message: "User logged in successfully", token, user: userData });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });

  }
};

//fetch the all user details 


export const fetchUsers = async (req: Request, res: Response): Promise<void> => {
  try {

    const users = await userRepository.findUsers()
    console.log(users)

    res.status(200).json({ success: true, message: "User signup  successfully", usersData: users });

  } catch {
    console.log("error in fetcch users")
  }
}
export const fetchUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params
    console.log(";;")
    const users = await userRepository.findUsers()
    console.log(users)

    res.status(200).json({ success: true, message: "User signup  successfully", usersData: users });

  } catch {
    console.log("error in fetcch users")
  }
}




// edit the user profile controller 


export const editprofile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body)
    const { userId } = req.params; // Assuming you have the user ID in the request parameters
    const userData = req.body;
    const updatedData = await userRepository.updateUser(userId, userData)
    console.log(updatedData)

    res.status(200).json({ success: true, message: "profile updated succes fully ", userData: updatedData })

  } catch {
    console.log("error in edit profile ")
  }
}



// to block and unblockk this user controller 

export const block = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("for block", req.body)

    const { userId, isBlock } = req.body;
    // Call the repository method to block the user
    await userRepository.blockUser(userId, isBlock);
    res.status(200).json({ message: "User blocked successfully" });


  } catch {
    console.log("error in edit profile ")
  }
}


// verfiy email for forget the password 

export const verifyemail = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body, "ind")
    const { email } = req.body



    const emailExists = await userRepository.emailExists(email);

    if (!emailExists) {
      console.log("enter to the existuser")


      res.status(400).json({ error: "email is exist" });

    }


    res.status(200).json({ success: true, message: "email verified" })
    await emailVerification(email);


  }
  catch (error) {

    console.log(error)

  }

}


// verify the otp for for get password 


export const verifyEmailOtp = async (req: Request, res: Response): Promise<void> => {
  try {

    console.log("enter to new otp ")


    const { otp } = req.body;

    if (otp == otpVal) {

      console.log("otp is correct forget ")
      res.status(200).json({ success: true, message: "otp verified" })


    } else {
      res.status(400).json({ success: false, error: "Incorrect OTP" });

    }




  }
  catch (error) {

    console.log(error)

  }

}



//change password logic 


export const changepassword = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Entering changepassword function");
    console.log(req.body);

    // Extract email and password from request body
    const { email, password } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the changepassword function with the new password and email
    const user = await userRepository.changepassword(hashedPassword, email);

                         if (user) {
      // If user is found and password is updated successfully
      console.log("Password changed successfully");
      res.status(200).json({ success: true, message: "Password changed successfully" });
    } else {
      // If user is not found
            console.log("User not found");
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    //   Catch any errors that occur during the process
        console.error("Error changing password:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
  }
}



// resend otp logic 


export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.userData.email
    await emailVerification(email);

    // Extract email and password from request body

  } catch (error) {
    // Catch any errors that occur during the process
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// create a new  post into feeed 
