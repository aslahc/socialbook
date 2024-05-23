import React, { useRef, useState } from "react";
import { User } from "../../types/types";

interface FileMessageProps {
  saveMessage: (
    receiverId: string,
    videoUrl: string,
    timestamp: number,
    messageType: string
  ) => void;
  sendMessage: (
    receiverId: string,
    videoUrl: string,
    timestamp: number,
    messageType: string
  ) => void;
  user: User;
}

const FileMessage: React.FC<FileMessageProps> = ({
  saveMessage,
  sendMessage,
  user,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const presetKey: string = "cloudinaryimg";
  const cloudName: string = "dy9ofwwjp";
  // Function to handle SVG icon click
  const handleIconClick = () => {
    // Trigger click on the file input element
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file

    // Handle the selected file
    if (file) {
      setSelectedFile(file);
      setShowModal(true); // Show modal after file selection
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null); // Clear selected file
  };

  const handleSendFile = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        formData.append("upload_preset", presetKey);
        setUploading(true);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          setUploading(false);

          const data = await response.json();
          const fileUrl = data.secure_url;
          let timestamp = new Date().getTime();
          const messageType = "file";
          sendMessage(user._id, fileUrl, timestamp, messageType);
          saveMessage(user._id, fileUrl, timestamp, messageType);
        } else {
          console.error(
            "Failed to upload file to Cloudinary:",
            response.status,
            response.statusText
          );
        }

        closeModal(); // Close modal after sending
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div>
      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* SVG icon triggering file selection */}
      <svg
        className="w-6 h-6 text-indigo-400 cursor-pointer"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleIconClick} // Handle click on SVG icon
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

      {/* Modal to display selected file */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
            <p className="text-xl font-semibold mb-4">Selected File</p>
            <p>{selectedFile?.name}</p>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-neumorphic-concave hover:shadow-neumorphic-convex transition-all duration-300"
                onClick={closeModal}
              >
                Close
              </button>

              {uploading ? (
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-neumorphic-concave hover:shadow-neumorphic-convex transition-all duration-300"
                  disabled
                >
                  <div className="relative w-6 h-6 mr-2">
                    <div className="absolute inset-0 rounded-full bg-blue-400 blur-sm"></div>
                    <div className="relative flex items-center justify-center rounded-full h-5 w-5 bg-blue-500 shadow-md">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-2 border-t-blue-200"></div>
                    </div>
                  </div>
                  <span></span>
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-neumorphic-concave hover:shadow-neumorphic-convex transition-all duration-300"
                  onClick={handleSendFile}
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileMessage;
