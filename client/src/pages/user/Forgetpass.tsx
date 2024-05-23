import React, { useState } from "react";
import axiosInstance from "../../axios/axios";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "sonner";

const baseURL = axiosInstance.defaults.baseURL;
interface VerificationProps {
  email: string;
}

function Forgetpass() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");

  const handleVerification = async () => {
    try {
      console.log("fetch", email);
      // Assuming you have a backend API endpoint to send the verification email
      const response = await fetch(`${baseURL}/verifyemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Email sent successfully

        navigate("/verifyEmailOtp", { state: { email } });
      } else {
        // Error sending email
        toast.error("email is not exist");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("email is not exist");
    }
  };

  return (
    <div>
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

            <form className="mt-8">
              <div className="flex justify-between max-w-xs mx-auto">
                <div className="w-80 h-16">
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-8 space-y-5">
                <button
                  type="button"
                  onClick={handleVerification}
                  className="w-full py-5 bg-indigo-700 text-white text-sm rounded-xl shadow-sm focus:outline-none"
                >
                  Verify Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgetpass;
