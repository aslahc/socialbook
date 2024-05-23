import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axios";
const baseURL = axiosInstance.defaults.baseURL;
function Changepass() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Password strength regex validation (at least 8 characters including at least one uppercase letter, one lowercase letter, one number, and one special character)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Reset errors
    setErrors({ password: "", confirmPassword: "" });

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }

    // Check if password meets strength requirements
    if (!strongPasswordRegex.test(formData.password)) {
      setErrors({
        ...errors,
        password:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
      return;
    }

    try {
      // Send new password to the backend
      const response = await fetch(`${baseURL}/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include any additional headers if needed
        },
        body: JSON.stringify({ password: formData.password, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }
      navigate("/login");
      // If password update is successful, you can proceed with your logic
      console.log("Password updated successfully.............");
    } catch (error) {
      console.error("Error updating password:", error);
      // Handle error appropriately, such as displaying a message to the user
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
                <p>Enter your new password</p>
              </div>
            </div>
            <form className="mt-8" onSubmit={handleVerify}>
              <div className="flex flex-col max-w-xs mx-auto">
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
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                    errors.password ? "border-red-500" : "dark:red-gray-800"
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
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "dark:red-gray-800"
                  } dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">{errors.confirmPassword}</span>
                )}
              </div>
              <div className="flex flex-col mt-8 space-y-5">
                <button
                  className="w-full py-5 bg-indigo-400 text-white text-sm rounded-xl shadow-sm focus:outline-none"
                  //   disabled={!!errors.password || !!errors.confirmPassword}
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Changepass;
