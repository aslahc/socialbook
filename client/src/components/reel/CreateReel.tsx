import React, { useState, ChangeEvent, useRef } from 'react';
import axiosInstance from '../../axios/axios'
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../utils/reducers/PostData';

const CreateReel: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const presetKey: string = 'cloudinaryimg'; 
  const cloudName: string = 'dy9ofwwjp';

  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setShowModal(false);
  };

  const handleVideoChangeModal = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handlePostReel = async () => {
    try {
      if (selectedVideo) {
        const formDataFile = new FormData();
        formDataFile.append('file', selectedVideo);
        formDataFile.append('upload_preset', presetKey);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
          method: 'POST',
          body: formDataFile,
        });

        console.log('Posting reel with selected video:', selectedVideo);
        const data = await response.json();
        const reelUrl = data.secure_url;

        if (reelUrl) {
          const type = "reel";
          const response = await axiosInstance.post(`/createPost`, { userId, postUrl: reelUrl, type }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const newPost = response.data.postData;
          dispatch(addPost(newPost));
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error posting reel:', error);
    }
  };

  const handleClickCreateReel = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleVideoChange} 
        className="hidden" 
        ref={fileInputRef} 
      />
      <button
        onClick={handleClickCreateReel}
        className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-900 text-white font-semibold py-2 px-4 rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Create Reel
      </button>

      {showModal && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative bg-white rounded-2xl shadow-lg">
            <div className="neumorphism-container p-8">
              <video className="w-full rounded-xl h-[600px]" controls>
                <source src={URL.createObjectURL(selectedVideo)} type={selectedVideo.type || ''} />
                Your browser does not support the video tag.
              </video>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={handleCloseModal}
                  className="neumorphism-button bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVideoChangeModal}
                  className="neumorphism-button bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Change Video
                </button>
                <button
                  onClick={handlePostReel}
                  className="neumorphism-button bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Post Reel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReel;
