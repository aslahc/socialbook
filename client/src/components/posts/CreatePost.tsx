import React, { ChangeEvent, useState, useRef } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { useSelector } from "react-redux";
import axios from 'axios';
import axiosInstance from '../../axios/axios'
import Cropper from 'react-easy-crop';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const baseURL = axiosInstance.defaults.baseURL;

const CreatePost = () => {
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id
  interface FormInputs {
    caption: string;
    postUrl: string;
  }
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

  const [image, setImage] = useState<string | undefined>(userData.profileimg || ''); 

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
    } } else {
      // If the selected file is not an image, show an error message
      toast.error("Please select an image file.");
    }
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
      axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formDataFile)
        .then(res => {
         
          setCropImg(true)
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
  
  const handleCreatePostClick= async () =>{ 
    try{

      axios
      .post(`${baseURL}/createPost`, {...postData,userId})
      .then(response => {
        console.log('Response from server:', response.data);
        
        setPostData({ caption: '', postUrl: '' });
        setSelectedFile(null);
        // Log the response from the server
      })
    .catch(error => {
      console.error('Error creating post:', error);
    });
    }catch (error) {
      console.error('Error cropping image:', error);
    }
  
  }


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
 <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 max-w-3xl">
  <div className="flex items-center mb-3">
    <img
      src={userData.profileimg}
      alt="Profile picture"
      className="w-10 h-10 rounded-full object-cover ml-2"
    />
    <p className="font-semibold ml-4 underline italic">{userData.username}</p>
  </div>
  <input
    type="text"
    name="caption"
    value={postData.caption}
    onChange={handleInputChange}
    placeholder="What's on your mind?"
    className="border-b border-gray-300 focus:outline-none focus:border-blue-400"
  />

  <div className="flex items-center justify-between">
    <div className="flex gap-2">
      <button
        type="button"
        className="flex items-center text-blue-400 hover:text-blue-600 focus:outline-none"
        onClick={handlePhotoIconClick}
      >
        <AiOutlineCamera className="w-5 h-5" />
        <span className="ml-1">Add Photo</span>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
    <button onClick={handleCreatePostClick} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">

<svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
</svg>
<span className="sr-only">Icon description</span>
</button>
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
           <img className="w-full h-auto object-contain" src={image} alt="Selected Post Photo" />
           <div className="flex justify-end mt-4"> {/* Updated line */}
             <button  onClick={handleCloseModal} type="button" className="focus:outline-none bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
               Next
             </button>
           </div>
         </div>
       </div>
     </div>
     
      )}
    </div>
  );
};

export default CreatePost;
 