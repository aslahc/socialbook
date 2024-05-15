import React, { ChangeEvent, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addPost } from '../../utils/reducers/PostData';
import axiosInstance from '../../axios/axios';
import Cropper from 'react-easy-crop';
import { Carousel } from 'react-responsive-carousel';

const CreatePost = () => {
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;
  interface FormInputs {
    caption: string;
    postUrl: string;
  }
  const dispatch = useDispatch();

  const presetKey: string = 'cloudinaryimg';
  const cloudName: string = 'dy9ofwwjp';

  const [postData, setPostData] = useState<FormInputs>({ caption: '', postUrl: '' });
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [crop, setCrop] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handlePhotoIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList && fileList.length > 0) {
      const filesArray: File[] = Array.from(fileList);

      // Filter to only include image files
      const imageFiles: File[] = filesArray.filter(file => file.type.startsWith('image/'));

      setSelectedFile(imageFiles);
      setShowCropModal(true);
    } else {
      toast.error("Please select an image file.");
    }
  };

  const handleCropChange = (crop: { x: number, y: number }, index: number) => {
    setCrop(crop);
  };
  
  const handleZoomChange = (zoom: number, index: number) => {
    setZoom(zoom);
  };
  
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any, index: number) => {
    setCroppedArea(croppedAreaPixels);
  };
  
  const handleCloseModal = () => {
    setShowCropModal(false);
    setSelectedFile([]);
    setCroppedArea(null);
    setCroppedImages([])
  };

  const handleConfirmCrop = async () => {
    try {
      setUploading(true);
      const croppedImagesArray: string[] = [];

      for (const file of selectedFile) {
        const croppedImageBlob = await getCroppedImage(file, croppedArea);
        const formDataFile = new FormData();
        console.log(croppedImageBlob)
        formDataFile.append('file', croppedImageBlob);
        formDataFile.append('upload_preset', presetKey);
        console.log("image sending to the cloudinary")
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formDataFile);
        console.log(response)
        const imageUrl = response.data.secure_url;
        croppedImagesArray.push(imageUrl);
        setSelectedFile([])
      }
       console.log("this is cropeed images array",croppedImagesArray)
      setCroppedImages(croppedImagesArray);
      setUploading(false);
      setShowCropModal(false);
    } catch (error) {
      console.error('Error cropping and uploading images:', error);
      setUploading(false);
    }
  };

  const token = localStorage.getItem('token');
  const handleCreatePostClick = async () => {
    try {
      console.log("going to save the post ")
      console.log(croppedImages)
      const type = "image"

      const response = await axiosInstance.post(`/createPost`, { ...postData, userId, postUrl: croppedImages,type }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
       console.log(response.data.postData)

      const newPost = response.data.postData;
      console.log("going to dispatch the newPst")
      dispatch(addPost(newPost));
      setPostData({ caption: '', postUrl: '' });
      setCroppedImages([]);
      setSelectedFile([])
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };


  const closeModal = () => {
    setSelectedFile([]);
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
  const handleNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % selectedFile.length);
    setCrop({ x: 0, y: 0 }); // Reset crop position when changing images
    setZoom(1); // Reset zoom level
  };

  
  return (
    <div>
<div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
  <div className="flex items-center mb-4">
    <img
      src={userData?.profileimg || "/download.jpeg"}
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
      multiple
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


{selectedFile.length > 0 && (
  <div key={currentImageIndex} className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
    <div className="w-[40rem] h-[40rem] relative">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <Cropper
          image={selectedFile[currentImageIndex] && URL.createObjectURL(selectedFile[currentImageIndex])}
          crop={crop}
          zoom={zoom}
          aspect={2 / 2}
          onCropChange={(crop) => handleCropChange(crop, currentImageIndex)}
          onZoomChange={(zoom) => handleZoomChange(zoom, currentImageIndex)}
          onCropComplete={(croppedArea, croppedAreaPixels) => onCropComplete(croppedArea, croppedAreaPixels, currentImageIndex)}
        />
        <div className='absolute top-5 right-0 m-4 z-10 flex items-center'>
       <div className="flex justify-center space-x-4">
        
        {
        selectedFile.length > 0 && (
          <button
          onClick={handleNextImage}
          className="relative mr-4 flex items-center px-6 py-3 rounded-lg shadow-inner bg-white text-indigo-500 font-semibold"
          style={{
            boxShadow: "6px 6px 12px #c3c3c3,",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Next Image
        </button>

        )
        }  
       <div className="flex justify-center space-x-4">
  <button
    onClick={handleCloseModal}
    className="relative flex items-center px-6 py-3 rounded-lg shadow-inner bg-white text-indigo-500 font-semibold"
    style={{
      boxShadow: "6px 6px 12px #c3c3c3, -6px -6px 12px #ffffff",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
    Close
  </button>

  <button
    onClick={handleConfirmCrop}
    className="relative flex items-center px-6 py-3 rounded-lg shadow-inner bg-white text-indigo-500 font-semibold"
    style={{
      boxShadow: "6px 6px 12px #c3c3c3, -6px -6px 12px #ffffff",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
    Confirm Crop
  </button>
</div>
</div>

        </div>
      </div>
    </div>
  </div>
)}

{croppedImages.length > 0 && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out z-50">
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
        {/* Display a single cropped image */}
        <img
          src={croppedImages[currentImageIndex]}
          className="w-full h-auto object-contain rounded-lg"
          alt={`Cropped Image ${currentImageIndex}`}
        />

        {/* Caption input */}
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

        {/* Buttons for navigation and posting */}
        <div className="flex justify-between">
        <div className="flex space-x-2">
       {
        
        croppedImages.length > 1 && (

          <><button
                        onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? croppedImages.length - 1 : prevIndex - 1))}
                        type="button"
                        className="relative flex items-center px-4 py-2 rounded-lg shadow-inner bg-white text-indigo-500 font-semibold"
                        style={{
                          boxShadow: "6px 6px 12px #c3c3c3, -6px -6px 12px #ffffff",
                        }}
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button><button
                        onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === croppedImages.length - 1 ? 0 : prevIndex + 1))}
                        type="button"
                        className="relative flex items-center px-4 py-2 rounded-lg shadow-inner bg-white text-indigo-500 font-semibold"
                        style={{
                          boxShadow: "6px 6px 12px #c3c3c3, -6px -6px 12px #ffffff",
                        }}
                      >
                          Next
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button></>
        )
      }
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleCloseModal}
            type="button"
            className="relative flex items-center px-4 py-2 rounded-lg shadow-inner bg-white text-indigo-500 font-semibold"
            style={{
              boxShadow: "6px 6px 12px #c3c3c3, -6px -6px 12px #ffffff",
            }}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>

          {/* Post button */}
          <button
            onClick={handleCreatePostClick}
            type="button"
            className="relative flex items-center px-4 py-2 rounded-lg shadow-inner bg-indigo-500 text-white font-semibold"
            style={{
              boxShadow: "6px 6px 12px #c3c3c3, -6px -6px 12px #ffffff",
            }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Post
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{uploading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  </div>
)}

    </div>
  );
};

export default CreatePost;
 