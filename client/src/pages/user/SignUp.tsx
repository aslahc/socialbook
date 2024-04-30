import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../axios/axios';
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
  const [formData, setFormData] = useState<FormInputs>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormInputs>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;
    const newErrors: FormInputs = {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };
    const phoneRegex = /^[0-9]{10}$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    // Basic validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;

    }else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
      valid = false;
    }
    
    if(!formData.confirmPassword.trim()){
      newErrors.confirmPassword = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    } 
    if (!strongPasswordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least 6 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character';
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }


    // Set errors if validation fails
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/signUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    
      const responseData = await response.json();
    console.log(responseData.error ,"erro an ")
    toast.error(responseData.error);

      if (response.ok) {
        if (responseData.success) {
          const userData = responseData.userData;
          navigate('/VerifyOtp', { state: { userData } });
        } else {
          // Handle server-side errors
          throw new Error(responseData.error || "Unknown error");
        }
    
        // Reset the form after successful submission
        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        // Handle non-200 status codes
        if (responseData.error == "Username already exists") {
          // Display toast for username already exists error
          // toast.error(responseData.error);
        } else if(responseData.error === "email is exist") {
          // toast.error(responseData.error)
        }else {
          // Display toast for other errors
          const errorMessage = responseData.message || '';
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      // Handle fetch error
      const errorMessage = error.message || "An error occurred while submitting the form. Please try again later.";
      toast.error(errorMessage);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex h-full">
          <div className="w-1/2 bg-indigo-400 text-white p-8 flex items-center justify-center">
            <h3 className="text-3xl font-mono font-bold text-center">
              Online Community makes <br /> people more Creative
            </h3>
          </div>
          <div className="w-1/2 p-8">
            {/* <h3 className='text-right mb-4'>Have an account? <Link to='/login'>Login</Link></h3> */}
            <h1 className='font-bold text-3xl text-center mb-3'>Create your account</h1>
            <h2 className='text-lg text-center text-indigo-400 mb-4'>Sign up into your account</h2>
            <div>
              <button
                type="button"
                className="ml-44 text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
              >
                <svg
                  className="w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 19"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
            <div className='w-full flex justify-center'>
              <hr className='flex-grow border-gray-500' /><span className="px-2 text-gray-600">or continue with </span> <hr className='flex-grow border-gray-500' />
            </div>
            <div className="mb-5 px-20">
              <label htmlFor="user-input" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input
                type="text"
                id="user-input"
                name="username"
                placeholder='Enter your name'
                value={formData.username}
                onChange={handleInputChange}
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.username ? 'border-red-500' : 'dark:red-gray-800'} dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.username && <span className="text-red-500">{errors.username}</span>}
              <label htmlFor="email-input" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                type="email"
                id="email-input"
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter your email'
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.email ? 'border-red-500' : 'dark:red-gray-800'} dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.email && <span className="text-red-500">{errors.email}</span>}
              <label htmlFor="phone-input" className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
              <input
                type="text"
                id="phone-input"
                name='phone'
                value={formData.phone}
                onChange={handleInputChange}
                placeholder='Enter your phone number'
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.phone ? 'border-red-500' : 'dark:red-gray-800'} dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.phone && <span className="text-red-500">{errors.phone}</span>}
              <label htmlFor="password-input" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                id="password-input"
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Enter your password'
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.password ? 'border-red-500' : 'dark:red-gray-800'} dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.password && <span className="text-red-500">{errors.password}</span>}
              <label htmlFor="confirm-input" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
              <input
                type="password"
                id="confirm-input"
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder='Confirm your password'
                className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.confirmPassword ? 'border-red-500' : 'dark:red-gray-800'} dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
              <button type="submit"  className=" w-full mt-4 text-white bg-gradient-to-r from-indigo-500 via-indigo-400-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Sign Up</button>
              <h3 className="text-end  mb-4 mt-3">alredy have an account?<Link to='/login' className='text-indigo-400'>login</Link></h3>
           
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
