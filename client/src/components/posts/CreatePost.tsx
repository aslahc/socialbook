import React, { ChangeEvent, useState, useRef, Suspense } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import axiosInstance from '../../axios/axios'
import Cropper from 'react-easy-crop';
import PostData, {addPost} from '../../utils/reducers/PostData'
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// const baseURL = axiosInstance.defaults.baseURL;
const LazyLoadedImage = ({ imageUrl }: { imageUrl: string }) => {
  return <img className="w-full h-auto object-contain" src={imageUrl} alt="Selected Post Photo" />;
};
const CreatePost = () => {
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id
  interface FormInputs {
    caption: string;
    postUrl: string;
  }
  const dispatch = useDispatch();

  const presetKey: string = 'cloudinaryimg'; 
  const cloudName: string = 'dy9ofwwjp';
  
  const [postData, setPostData] = useState<FormInputs>({ caption: '', postUrl: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropedImg, setCropImg] = useState(false);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };
  console.log(postData,".....00000")

  const [image, setImage] = useState<string | undefined>(''); 

  const handlePhotoIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.type.startsWith('image/')) {
        
      setSelectedFile(file);
    //   setCroppedImage
    //   setShowConfirmButton(true);
    }else {

      toast.error("Please select an image file.");
    } } 
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCropChange = (crop: { x: number, y: number }) => {
    setCrop(crop);
  };

  const handleZoomChange = (zoom: number) => {
    setZoom(zoom);
  };
  const handleCloseModal = async () =>{
    setImage("")
    setCropImg(false)
  }
 

  const handleConfirmCrop = async () => {
    try {
      const croppedImageBlob = await getCroppedImage(selectedFile!, croppedArea);
      
      const formDataFile = new FormData();

      // Check if selectedFile is not null before appending it to the FormData
      if (selectedFile) {
        formDataFile.append('file', croppedImageBlob);
      }
      setSelectedFile(null);
      formDataFile.append('upload_preset', presetKey);

      setCropImg(true)
      
      axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formDataFile)
        .then(res => {
         
         
          setImage(res.data.secure_url);
          setPostData({ ...postData, postUrl: res.data.secure_url });
        

        })
        .catch(err => console.log(err));
      
        // Move setCroppedImage(postUrl) inside the axios .then() block
        // to ensure it runs after the image is uploaded
        // and the postUrl is updated
        // Also, postUrl should be res.data.secure_url
        // instead of directly using postUrl variable
        // which may not be updated yet.
      
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };
  const token = localStorage.getItem('token')
  const handleCreatePostClick = async () => {
    try {
      const response = await axiosInstance.post(`/createPost`, { ...postData, userId }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Response from server:', response.data);
      const newPost = response.data.postData;
      dispatch(addPost(newPost));
  
      setCropImg(false);
      setPostData({ caption: '', postUrl: '' });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  


  const closeModal = () => {
    setSelectedFile(null);
    // setShowConfirmButton(false);
  };

  const getCroppedImage = (file: File, croppedArea: any) => {
    return new Promise<Blob>((resolve, reject) => { 
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = croppedArea.width;
        canvas.height = croppedArea.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(
          image,
          croppedArea.x * scaleX,
          croppedArea.y * scaleY,
          croppedArea.width * scaleX,
          croppedArea.height * scaleY, 
          0,
          0,
          croppedArea.width,
          croppedArea.height
        );
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to crop image'));
          }
        }, 'image/jpeg');
      };
    });
  };

  return (
    <div>
<div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
  <div className="flex items-center mb-4">
    <img
      src={userData?.profileimg}
      alt="Profile picture"
      className="w-12 h-12 rounded-full object-cover mr-4"
    />
    <p className="font-semibold text-gray-800 underline italic">
      {userData?.username}
    </p>
  </div>
  <div className="flex items-center mb-4">
    <input
      type="text"
      name="caption"
      value={postData.caption}
      onChange={handleInputChange}
      placeholder="What's on your mind?"
      className="border-0 bg-gray-100 rounded-3xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="bg-gray-100 rounded-3xl p-2 mr-4">
        <label
          onClick={handlePhotoIconClick}
          className="flex items-center px-3 py-2 bg-white rounded-3xl shadow-md cursor-pointer hover:bg-gray-200 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 text-blue-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-800">
            Select an image
          </span>
        </label>
      </div>
    </div>
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleFileChange}
    />
    {postData.caption && (
      <button
        onClick={handleCreatePostClick}
        type="button"
        className="bg-blue-500 rounded-3xl px-4 py-2 text-white font-medium flex items-center hover:bg-blue-600 transition-colors duration-200"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <span>Post</span>
      </button>
    )}
  </div>
</div>


      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="w-[40rem] h-[40rem] relative">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Cropper
                image={URL.createObjectURL(selectedFile)}
                crop={crop}
                zoom={zoom}
                aspect={2 / 2}
                onCropChange={handleCropChange}
                onZoomChange={handleZoomChange}
                onCropComplete={onCropComplete}
              />
              <div className='absolute top-5 right-0 m-4 z-10'>
                <button onClick={closeModal} className="mr-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
                <button onClick={handleConfirmCrop} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Crop</button>
              </div>
            </div>
          </div>
        </div>
      )}

     {cropedImg && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out z-50">
    <div className="flex items-center justify-center h-screen">
      
      <div className="bg-white rounded-lg shadow-md px-4 pt-6 pb-8 w-full max-w-md">
        
      <div className="mt-4">
      <div className="flex items-center mb-4">
    <input
      type="text"
      name="caption"
      value={postData.caption}
      onChange={handleInputChange}
      placeholder="What's on your mind?"
      className="border-0 bg-gray-100 rounded-3xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
        </div>
        
        {image && (
      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="spinner"></div>
    </div>}>
      <LazyLoadedImage imageUrl={image} />
    </Suspense>
      )}
        
        {/* Input box added below the image */}
    
        
        {/* Button for next or close */}
        <div className="flex justify-end mt-4">
        <button
  onClick={handleCloseModal}
  type="button"
  className="focus:outline-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md mr-2
    shadow-md transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
>
  {/* Close (X) Icon */}
  <svg
    className="w-4 h-4 mr-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
  Close
</button>

          {postData.postUrl && (
  <button
    onClick={handleCreatePostClick}
    type="button"
    className="bg-blue-500 rounded-3xl px-4 py-2 text-white font-medium flex items-center hover:bg-blue-600 transition-colors duration-200"
  >
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
    <span>Post</span>
  </button>
)}

        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CreatePost;
 