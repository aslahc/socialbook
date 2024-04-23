import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useLocation, useNavigate ,} from 'react-router-dom';
// import { setUser } from '../../utils/reducers/userData';
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import {setUserDetails} from '../../utils/reducers/userDetails'
import axiosInstance from '../../axios/axios'
const baseURL = axiosInstance.defaults.baseURL;

interface OtpInputs {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
}

function ForgetOtp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
    const { email } = location.state;
//   const location = useLocation();
//     const { userData } = location.state;
    // console.log(userData,"dsd")
  const [otpInputs, setOtpInputs] = useState<OtpInputs>({
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpInputs({
      ...otpInputs,
      [name]: value,
    });
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { otp1, otp2, otp3, otp4 } = otpInputs;
    const otp = otp1 + otp2 + otp3 + otp4;
    try {

        console.log("otp...",otp)
      const response = await fetch(`${baseURL}/verifyEmailOtp`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
             
              otp: otp,
          }),
      });
  
      const responseData = await response.json();
     console.log(response)
      if (response.ok) {
          if (responseData.success) {
           
              navigate('/changepassword',{ state: { email } });
          } else {
              throw new Error(responseData.error || "Unknown error");
          }
      } else {
          if (responseData.error) {
              toast.error(responseData.error);
          } else {
              const errorMessage = responseData.message || 'Failed to verify OTP';
              toast.error(errorMessage);
          }
      }
  } catch (error: any) {
      const errorMessage = error.message || "An error occurred while verifying OTP. Please try again later.";
      toast.error(errorMessage);
      console.error('Error verifying OTP:', error);
  }
  
    
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 bg-teal-600 text-white p-8 flex items-center justify-center hidden md:flex">
        <h3 className="text-3xl font-mono font-bold text-center">
          Online Community makes <br /> people more Creative
        </h3>
      </div>
      <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
        <div className="relative bg-gray-50 px-6 py-12 max-w-lg rounded-2xl shadow-xl w-full">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email ba**@dipainhouse.com</p>
            </div>
          </div>
          <form className="mt-8" onSubmit={handleVerify}>
            <div className="flex justify-between max-w-xs mx-auto">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="w-16 h-16">
                  <input
                    className="w-full h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    name={`otp${index}` as keyof OtpInputs}
                    id={`otp${index}`}
                    maxLength={1}
                    value={otpInputs[`otp${index}` as keyof OtpInputs]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col mt-8 space-y-5">
              <button className="w-full py-5 bg-blue-700 text-white text-sm rounded-xl shadow-sm focus:outline-none">
                Verify Account
              </button>
              <div className="flex items-center justify-center text-sm font-medium space-x-1 text-gray-500">
                <p>Didn't receive code?</p>
                <a className="text-blue-600" href="/" target="_blank" rel="noopener noreferrer">
                  Resend
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetOtp;
