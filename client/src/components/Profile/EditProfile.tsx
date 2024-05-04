import React, { useRef, ChangeEvent, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../axios/axios'
import {  useParams } from "react-router-dom";
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from "react-redux";

import { setUserDetails } from '../../utils/reducers/userDetails';
import { toast } from "sonner";



// const baseURL = axiosInstance.defaults.baseURL;
interface FormInputs {
  firstName: string,
  lastName: string,
  email: string,
  profession: string,
  bio: string,
  imageUrl: string 
  bannerUrl:string
}
function EditProfile() {
const dispatch = useDispatch();
const navigate = useNavigate();

  const { id } = useParams();
  const presetKey: string = 'cloudinaryimg'; 
  const cloudName: string = 'dy9ofwwjp'; 

  const fileInputRefProfile = useRef<HTMLInputElement>(null);
  const fileInputRefBanner = useRef<HTMLInputElement>(null);


    const userData = useSelector((state: any) => state.userDetails.user||'');
    console.log(userData._id)
  console.log(userData)
  const [formData, setFormData] = useState<FormInputs>({
    firstName: userData.fname || '',
    lastName: userData.lname || '',
    email: userData.email || '',
    profession: userData.profession || '',
    bio: userData.bio || '',
    imageUrl: userData.profileimg || '', 
    bannerUrl: userData.bannerImg || ''
  });

  const [image, setImage] = useState<string | undefined>(userData.profileimg || '', ); 
  const [bannerImage, setBannerImage] = useState<string | undefined>(userData.bannerImg || '');
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleButtonClickProfile = () => {
    if (fileInputRefProfile.current) {
      fileInputRefProfile.current.click();
    }
  };
  
  const handleButtonClickBanner = () => {
    if (fileInputRefBanner.current) {
      fileInputRefBanner.current.click();
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const formDataFile = new FormData();
      const uniqueFilename = `${uuidv4()}_${file.name}`; // Generate unique filename with UUID
      formDataFile.append('file', file, uniqueFilename); // Append file with unique filename
      formDataFile.append('upload_preset', presetKey);
  
      axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formDataFile)
        .then(res => {
          setImage(res.data.secure_url);
          setFormData({ ...formData, imageUrl: res.data.secure_url });
          console.log("--", res.data.secure_url);
        })
        .catch(err => {
          console.log(err);
          toast.error("Failed to upload image. Please try again.");
        });
  
      console.log('Selected file:', file);
    } else {
      toast.error("Please select another image.");
    }
  };
  
  const handleBannerFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const formDataFile = new FormData();
      const uniqueFilename = `${uuidv4()}_${file.name}`; // Generate unique filename with UUID
      formDataFile.append('file', file, uniqueFilename);
      formDataFile.append('upload_preset', presetKey); // Use the presetKey for uploading to Cloudinary
  
      axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formDataFile)
        .then(res => {
          setBannerImage(res.data.secure_url);
          setFormData({ ...formData, bannerUrl: res.data.secure_url }); // Update bannerUrl in formData
          console.log("--", res.data.secure_url);
        })
        .catch(err => {
          console.log(err);
          toast.error("Failed to upload image. Please try again.");
        });
  
      console.log('Selected file:', file);
    } else {
      toast.error("Please select another image.");
    }
  };
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("this is the data iam passing ", formData);

    try {
      const response = await axiosInstance.post(`/editprofile/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
   
      if (response.data.success) {
        console.log(response.data);
        const userData = response.data.userData;
        console.log(userData);
    dispatch(setUserDetails(userData));
    navigate(`/profile/${userData._id}`)  

      } else {
        console.error('Failed to update profile:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
          <a href="#" className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full">
            Public Profile
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
            Account Settings
          </a> 
        </div>
      </aside>
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
      <div className="relative h-48">
      <img
         className="h-full w-full object-cover absolute top-0 left-0"
        src={bannerImage || '/Hero-Banner-Placeholder-Dark-1024x480.png' }
        alt="Banner image"
      />
      <input
        ref={fileInputRefBanner}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerFileChange}
      />
      <button
        type="button"
        className="absolute top-2 right-2 px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        onClick={handleButtonClickBanner}
      >
        Change Banner
      </button>
    </div>
        <div className="p-2 md:p-4">
          <form onSubmit={handleSubmit}>
            <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
              <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
              <div className="grid max-w-2xl mx-auto mt-8">
                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src={image || "/download.jpeg"}
                    alt="Bordered avatar"
                  />
                  <div className="flex flex-col space-y-5 sm:ml-8">
                    <button
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                      onClick={handleButtonClickProfile}
                    >
                      Change picture
                    </button>
                    <input
                      ref={fileInputRefProfile}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {/* <button
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                    >
                      Delete picture
                    </button> */}
                  </div>
                </div>
                <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                  <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                    <div className="w-full">
                      <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Your first name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        placeholder="Your first name"
                       
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                        Your last name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        placeholder="Your last name"
                        
                      />
                    </div>
                  </div>
                  <div className="mb-2 sm:mb-6">
                    {/* <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                      Your email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="your.email@mail.com"
                      required
                    /> */}
                  </div>
                  <div className="mb-2 sm:mb-6">
                    <label htmlFor="profession" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                      Profession
                    </label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="your profession"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                      Bio
                    </label>
                    <textarea
                      id="message"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Write your bio here..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditProfile;
