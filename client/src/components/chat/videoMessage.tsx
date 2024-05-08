import React, { useRef, useState } from 'react';
import { User } from '../../types/types';
interface VideoMessageProps {
    saveMessage: (receiverId: string, videoUrl: string, timestamp: number, messageType: string) => void;
    sendMessage: (receiverId: string, videoUrl: string, timestamp: number, messageType: string) => void;
    user: User;
}


const VideoMessage: React.FC<VideoMessageProps> = ({ saveMessage, sendMessage,user  }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const presetKey: string = 'cloudinaryimg'; 
  const cloudName: string = 'dy9ofwwjp'; 
  const handleVideoSelect = () => {
    // Trigger the file input click when the SVG icon is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; // Get the first selected file

    if (selectedFile) {
      setSelectedVideo(selectedFile);
      // Reset the file input after processing the selected file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the file input value
      }
    }
  };

  const closeModal = () => {
    setSelectedVideo(null); // Clear the selected video when closing modal
  };

  const handleSendVideo = async () => {
    if (selectedVideo) {
        try {
            const formData = new FormData();
            formData.append('file', selectedVideo);
            formData.append('upload_preset', presetKey);
       console.log("resposene")
            // Upload video to Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
              method: 'POST',
              body: formData,
            });
    
            if (response.ok) {
                console.log("enterd to the eresposner ")
              const data = await response.json();
              console.log('Video uploaded to Cloudinary:', data.secure_url);
              const videoUrl = data.secure_url
              let timestamp = new Date().getTime();

              const messageType = 'video';
    
              // Send video URL and save message
              sendMessage(user._id, videoUrl, timestamp, messageType);
              saveMessage(user._id, videoUrl,timestamp, messageType);
              // Implement logic to handle the Cloudinary URL (e.g., save to database, display, etc.)
            } else {
              console.error('Failed to upload video to Cloudinary');
            }
    
            closeModal(); // Close the modal after sending
          } catch (error) {
            console.error('Error uploading video to Cloudinary:', error);
          }
    
    }
  };

  const handleVideoChange = () => {
    setSelectedVideo(null); // Clear the selected video to allow selecting a new one
    handleVideoSelect(); // Trigger file input to select a new video
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*" // Accept only video files
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the file input element
        onChange={handleFileChange}
      />

      {selectedVideo && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
            <video
              controls
              src={URL.createObjectURL(selectedVideo)}
              className="max-w-full h-auto rounded-lg shadow-neumorphic-convex"
            ></video>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-neumorphic-concave hover:shadow-neumorphic-convex transition-all duration-300"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-neumorphic-concave hover:shadow-neumorphic-convex transition-all duration-300"
                onClick={handleSendVideo}
              >
                Send
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-neumorphic-concave hover:shadow-neumorphic-convex transition-all duration-300"
                onClick={handleVideoChange}
              >
                Change Video
              </button>
            </div>
          </div>
        </div>
      )}

      <svg
        onClick={handleVideoSelect}
        className="w-6 h-6 text-indigo-400 cursor-pointer"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        ></path>
      </svg>
      <svg
  className="w-6 h-6 text-indigo-400 cursor-pointer"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M7 21h10a2 2 0 002-2V9a1 1 0 00-1-1H7a2 2 0 00-2 2v10a2 2 0 002 2z"
  ></path>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M15 3H7a2 2 0 00-2 2v4a1 1 0 001 1h10a1 1 0 001-1V5a2 2 0 00-2-2z"
  ></path>
</svg>
    </div>
  );
};

export default VideoMessage;
