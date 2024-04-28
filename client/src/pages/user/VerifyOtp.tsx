import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { setUserDetails } from '../../utils/reducers/userDetails';
import axiosInstance from '../../axios/axios';

const baseURL = axiosInstance.defaults.baseURL;

interface OtpInputs {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
}

function VerifyOtp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userData } = location.state;

  const [otpInputs, setOtpInputs] = useState<OtpInputs>({
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
  });

  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    // Start the timer immediately
    countdown = setTimeout(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        setResendDisabled(true); // Disable timer and show resend button
      }
    }, 1000);

    // Clear the timeout when component unmounts
    return () => clearTimeout(countdown);
  }, [timer]);

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
      const response = await fetch(`${baseURL}/otpverify`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              userData: userData,
              otp: otp,
          }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
          if (responseData.success) {
            console.log(responseData)
            console.log(responseData.userData._id)
              dispatch(setUserDetails(responseData.userData));
              
              navigate(`/profile/${responseData.userData._id}`);
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

  const handleResendOtp = async() => {
    // Add logic to resend OTP
    setTimer(60);
  setResendDisabled(false);
  try {
    const response = await axios.post(`${baseURL}/resendOtp`, {
      userData: userData,
     
    });

    const responseData = response.data;

    if (response.status === 200 && responseData.success) {
      dispatch(setUserDetails(responseData.userData));
      navigate(`/profile/${responseData.userData._id}`);
    } else {
      throw new Error(responseData.error || "Unknown error");
    }
  } catch (error: any) {
    const errorMessage = error.message || "An error occurred while verifying OTP. Please try again later.";
    toast.error(errorMessage);
    console.error('Error verifying OTP:', error);
  }


    // Add API call to resend OTP if required
  };

  

    return (
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/2 bg-indigo-400 text-white p-8 flex items-center justify-center hidden md:flex">
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
                {/* Show the resend button when timer runs out */}
                {resendDisabled ? (
                  <button className="text-blue-600" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                ) : (
                  <p>Resend OTP in {timer} seconds</p>
                )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  export default VerifyOtp;
