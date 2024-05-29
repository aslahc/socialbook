import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../axios/axios";
import { GoogleLogin } from "@react-oauth/google";
import useGoogleLogin from "../../utils/google/googleLogin";
import jwt_decode, { JwtPayload, jwtDecode } from "jwt-decode";

import { toast } from "sonner";

const baseURL = axiosInstance.defaults.baseURL;

interface FormInputs {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function SignUp() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin();

  const [formData, setFormData] = useState<FormInputs>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormInputs>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;
    const newErrors: FormInputs = {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };
    const phoneRegex = /^[0-9]{10}$/;
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    // Basic validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
      valid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }
    if (!strongPasswordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 6 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character";
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    // Set errors if validation fails
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (
        responseData.error === "email is exist" ||
        responseData.error === "Username already exists"
      ) {
        toast.error(responseData.error);
      }
      if (response.ok) {
        if (responseData.success) {
          const userData = responseData.userData;
          navigate("/VerifyOtp", { state: { userData } });
        } else {
          // Handle server-side errors
          throw new Error(responseData.error || "Unknown error");
        }

        // Reset the form after successful submission
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      // Handle fetch error
      const errorMessage =
        error.message ||
        "An error occurred while submitting the form. Please try again later.";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <form onSubmit={handleSubmit} className="flex-grow">
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 bg-indigo-400 text-white p-8  flex items-center justify-center hidden md:flex">
            <h3 className="text-3xl font-mono font-bold text-center">
              Online Community makes <br /> people more Creative
            </h3>
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="font-bold text-3xl text-center mb-3">
              Create your account
            </h1>
            <h2 className="text-lg text-center text-indigo-400 mb-4">
              Sign up into your account
            </h2>

            <div className="w-full flex justify-center my-4">
              <hr className="flex-grow border-gray-500" />
              <span className="px-2 text-gray-600">or continue with </span>{" "}
              <hr className="flex-grow border-gray-500" />
            </div>
            <div className="mb-5 px-4">
              <label
                htmlFor="user-input"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <input
                type="text"
                id="user-input"
                name="username"
                placeholder="Enter your name"
                value={formData.username}
                onChange={handleInputChange}
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.username ? "border-red-500" : "dark:red-gray-800"
                } dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username}</span>
              )}
              <label
                htmlFor="email-input"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email-input"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.username ? "border-red-500" : "dark:red-gray-800"
                } dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
              <label
                htmlFor="phone-input"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone-input"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.username ? "border-red-500" : "dark:red-gray-800"
                } dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.phone && (
                <span className="text-red-500">{errors.phone}</span>
              )}
              <label
                htmlFor="password-input"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password-input"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.username ? "border-red-500" : "dark:red-gray-800"
                } dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
              <label
                htmlFor="confirm-input"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-input"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.username ? "border-red-500" : "dark:red-gray-800"
                } dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.confirmPassword && (
                <span className="text-red-500">{errors.confirmPassword}</span>
              )}
              <button
                type="submit"
                className="w-full mt-4 text-white bg-gradient-to-r from-indigo-500 via-indigo-400-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Sign Up
              </button>
              <h3 className="text-right mb-4 mt-3">
                already have an account?
                <Link to="/login" className="text-indigo-400">
                  Login
                </Link>
              </h3>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
