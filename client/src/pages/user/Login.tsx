import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../utils/reducers/userDetails";
import { RootState } from "../../utils/store/store";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import useGoogleLogin from "../../utils/google/googleLogin";
import axiosInstance from "../../axios/axios";
import jwt_decode, { JwtPayload, jwtDecode } from "jwt-decode";

const baseURL = axiosInstance.defaults.baseURL;
interface FormInputs {
  username: string;
  password: string;
}

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin();
  useEffect(() => {
    toast.success("Username:   user, Password: 111");
  }, []);
  const [formData, setFormData] = useState<FormInputs>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormInputs>({
    username: "",
    password: "",
  });

  const handleinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    let valid = true;
    const newErrors: FormInputs = {
      username: "",
      password: "",
    };

    // Basic validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    // Set errors if validation fails
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/verifylogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;
        const user = responseData.user._doc;
        if (user.isBlock) {
          toast.error("User is blocked");
        } else {
          if (user.isAdmin) {
            localStorage.setItem("admin", "admin");

            navigate("/admin/dashboard");
          } else {
            localStorage.setItem("token", token);
            const userData = user;
            dispatch(setUserDetails(userData));
            console.log("navigating profile");
            // navigate(`/profile/${userData._id}`, { state: { userData } });
          }
        }
      } else {
        // Handle non-200 status codes
        if (response.status === 404) {
          toast.error("User not found");
        } else if (response.status === 401) {
          toast.error("Incorrect password");
        } else {
          // For other error scenarios, display a generic error message
          toast.error("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };
  // const handleGoogleSignIn = (credentialResponse: { credential?: string }) => {
  //   if (credentialResponse?.credential) {
  //     const decoded = jwtDecode(credentialResponse.credential);
  //     const { email, given_name, name } = decoded as {
  //       email: string;
  //       given_name: string;
  //       name: string;
  //     };
  //     googleLogin({
  //       email,
  //       firstName: name?.split(" ")[0],
  //       lastName: name?.split(" ")[1],
  //       given_name,
  //     });
  //   }
  // };
  const userData = useSelector((state: RootState) => state.userDetails.user);
  return (
    <div className="flex flex-col h-screen  ">
      <div className="flex flex-col md:flex-row flex-grow ">
        <div className="w-full md:w-1/2 bg-indigo-400 text-white p-8  flex items-center justify-center hidden md:flex">
          <h3 className="text-3xl font-mono font-bold text-center">
            Online Community makes <br /> people more Creative
          </h3>
        </div>
        <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <h1 className="font-bold text-3xl text-center mb-3">
              Welcome back
            </h1>
            <h2 className="text-lg text-center text-indigo-400 mb-4">
              Login into your account
            </h2>
            <div className="mb-5"></div>
            <div className="w-full flex justify-center items-center">
              <hr className="flex-grow border-gray-500" />
              <span className="px-2 text-gray-600">or continue with </span>{" "}
              <hr className="flex-grow border-gray-500" />
            </div>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                username
              </label>
              <input
                type="text"
                id="user-input"
                name="username"
                placeholder="Enter your name"
                value={formData.username}
                onChange={handleinputChange}
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.username
                    ? "border-red-500"
                    : "dark:border-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                }`}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username}</span>
              )}

              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password-input"
                name="password"
                value={formData.password}
                onChange={handleinputChange}
                placeholder="enter your password"
                className={`bg-gray-300 border border-gray-500   text-gray-900 text-sm rounded-lg focus:ring-blue-300  focus:border-blue-300 block w-full p-2.5 ${
                  errors.username ? "border-red-500" : "dark:red-gray-800"
                }  dark:placeholder-gray-400  dark:focus:ring-indigo-400 dark:focus:border-blue-500`}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
              <Link to="/verifyEmail"> forget password? </Link>
              <button
                type="submit"
                className=" w-full mt-4 text-white bg-gradient-to-r from-indigo-500 via-indigo-400-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Login
              </button>
              <h3 className="text-end  mb-4 mt-3">
                Don’t have an account?
                <Link to="/signup" className="text-indigo-400">
                  signup
                </Link>
              </h3>

              <div></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
