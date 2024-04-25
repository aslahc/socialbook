import React, { ChangeEvent, useState, useRef } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { useSelector } from "react-redux";
import axios from 'axios';
import axiosInstance from '../../axios/axios'
import Cropper from 'react-easy-crop';

const baseURL = axiosInstance.defaults.baseURL;

const CreatePost = () => {
  const userData = useSelector((state: any) => state.userDetails.user || '');

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
      setSelectedFile(file);
    //   setCroppedImage
    //   setShowConfirmButton(true);
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
        formDataFile.append('file', selectedFile);
      }
      
      formDataFile.append('upload_preset', presetKey);
      axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formDataFile)
        .then(res => {
          setImage(res.data.secure_url);
          setPostData({ ...postData, postUrl: res.data.secure_url });
          console.log("--", res.data.secure_url);
         setSelectedFile(null);
         setCropImg(true)

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
      <div className="bg-white flex flex-col rounded-lg justify-between p-4">
        <div className="flex items-center mb-3">
          <img
            src={userData.profileimg}
            alt="Profile picture"
            className="w-10 h-10 rounded-full object-cover ml-2"
          />
          <p className="font-semibold ml-4">{userData.username}</p>
        </div>
        <div className="text-gray-500 font-medium text-xs">What's Happening?........</div>
        <input
          type="text"
          name="caption"
          value={postData.caption}
          onChange={handleInputChange}
          placeholder="Write something here..."
          className="border border-gray-300 rounded-lg px-4 py-2 mt-4"
        />
        <div className="flex items-center justify-between align-middle">
          <div className="flex">
            <ul className="flex gap-2">
              <li>
                <button
                  type="button"
                  className="flex items-center text-blue-400 hover:text-blue-600"
                  onClick={handlePhotoIconClick}
                >
                  <AiOutlineCamera className="w-5 h-5" />
                  <span className="ml-1">Photo</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </li>
            </ul>
          </div>
          <button
            //   onClick={handleCreatePostClick}
            className="text-xs mb-4 bg-gradient-to-b from-purple-600 to-blue-400 text-white px-4 py-2 mt-6 rounded-md hover:bg-gray-800 focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
          >
            Create Post
          </button>
        </div>
        <hr />
      </div>

      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="w-[40rem] h-[40rem] relative">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Cropper
                image={URL.createObjectURL(selectedFile)}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
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
 