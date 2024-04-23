  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import axios from 'axios'; // Import Axios
import { useDispatch, useSelector } from "react-redux";
import userDetails, { setUserDetails } from '../../utils/reducers/userDetails'
import { RootState } from '../../utils/store'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  import axiosInstance from '../../axios/axios'
  const baseURL = axiosInstance.defaults.baseURL;
  interface FormInputs{
    username:string,
    password:string
  }

  function Login() {
const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormInputs>({
      username: '',
      password: '',

    });
    const [errors, setErrors] = useState<FormInputs>({
      username: '',
      password: '',
    });

    const handleinputChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
      const {name,value}=e.target;
      setFormData({...formData,[name]:value})
      setErrors({ ...errors, [name]: '' });
    }
    const handleSubmit =  async  (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // Prevent page reload
      let valid = true;
      const newErrors: FormInputs = {
        username: '',
        password: '',
      };

      // Basic validation
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
        valid = false;
      }
    
    
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
        valid = false;
      } 
    

      // Set errors if validation fails
      if (!valid) {
        setErrors(newErrors);
        return;
      }

      try {
        const response = await fetch(`${baseURL}/verifylogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;
          const user = responseData.user._doc;
        console.log(user,",...888888888888")
          if (user.isBlock) {
            toast.error('User is blocked');
          } else {
            if (user.isAdmin) {
    
              localStorage.setItem('admin', 'admin');

              navigate('/admin/dashboard');
            } else {
              localStorage.setItem('token', token);
              const userData = user;
              dispatch(setUserDetails(userData));
              console.log("navigating profile")
              // navigate(`/profile/${userData._id}`, { state: { userData } });
            }
          }
        } else {
          // Handle non-200 status codes
          if (response.status === 404) {
            toast.error('User not found');
          } else if (response.status === 401) {
            toast.error('Incorrect password');
          } else {
            // For other error scenarios, display a generic error message
            toast.error('An error occurred. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An error occurred. Please try again later.');
      }
      
      
    };
    const userData =  useSelector((state:RootState)=>state.userDetails.user)
console.log(userData,"qqqq")
    return (

      <div className="flex flex-col h-screen  ">
        <div className="flex flex-col md:flex-row flex-grow ">
          {/* Hide this div on mobile devices */}
          <div className="w-full md:w-1/2 bg-teal-600 text-white p-8  flex items-center justify-center hidden md:flex">
            <h3 className="text-3xl font-mono font-bold text-center">
              Online Community makes <br /> people more Creative
            </h3>
          </div>
          <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
            <form className="w-full max-w-md" onSubmit={handleSubmit}>
              <h1 className="font-bold text-3xl text-center mb-3">Welcome back</h1>
              <h2 className="text-lg text-center mb-4">Login into your account</h2>
              <div className="mb-5">
                <button
                  type="button"
                  className="w-full text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
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
              <div className="w-full flex justify-center items-center">
                <hr className="flex-grow border-gray-500" /><span className="px-2 text-gray-600">or continue with </span> <hr className="flex-grow border-gray-500" />
              </div>
              <div className="mb-5">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">username</label>
                <input
    type="text"
    id="user-input"
    name="username" 
    placeholder="Enter your name"
    value={formData.username}
    onChange={handleinputChange}
    className={`bg-gray-300 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.username ? 'border-red-500' :  'dark:border-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500'}`}
  />
  {errors.username && <span className="text-red-500">{errors.username}</span>}

                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  id="password-input"
                  name='password'
                  value={formData.password}
                  onChange={handleinputChange}
                  placeholder='enter your password'
                  className={`bg-gray-300 border border-gray-500   text-gray-900 text-sm rounded-lg focus:ring-blue-500  focus:border-blue-500 block w-full p-2.5 ${errors.username ? 'border-red-500' :  'dark:red-gray-800'}  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500`}

                />
 {errors.password && <span className="text-red-500">{errors.password}</span>}
                 <Link to='/verifyEmail'> forget password? </Link>
                <button type="submit" className="w-full mt-4 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm py-2.5 text-center">
                  Login
                </button>
              <h3 className="text-end  mb-4 mt-3">Don’t have an account?<Link to='/signup' className='text-green-400'>signup</Link></h3>

                <div>
                <ToastContainer />

    </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  export default Login;
