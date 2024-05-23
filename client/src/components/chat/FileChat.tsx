import React, { useState, useEffect } from "react";

interface FileMessageProps {
  fileUrl: string;
  fileName: string;
}

const FileChat: React.FC<FileMessageProps> = ({ fileUrl, fileName }) => {
  const [fileSize, setFileSize] = useState<string>("Calculating...");

  useEffect(() => {
    const fetchFileSize = async () => {
      try {
        const response = await fetch(fileUrl, { method: "HEAD" });
        const contentLength = response.headers.get("content-length");

        if (contentLength) {
          const fileSizeInBytes = parseInt(contentLength, 10);
          const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2); // Convert bytes to MB with 2 decimal places
          setFileSize(`${fileSizeInMB} MB`);
        } else {
          setFileSize("Unknown");
        }
      } catch (error) {
        console.error("Error fetching file size:", error);
        setFileSize("Unknown");
      }
    };

    fetchFileSize(); // Call fetchFileSize function when component mounts

    // Cleanup function (optional)
    return () => {
      // Cleanup logic (if needed)
    };
  }, [fileUrl]); // Re-run effect when fileUrl prop changes

  return (
    <div>
      <div className="flex items-center px-3 py-2 bg-indigo-50 rounded-lg">
        <div className="bg-gray-200 p-2 rounded-md">
          <svg
            className="w-8 h-8 text-indigo-600"
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
        <div className="flex flex-col ml-3">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 hover:underline"
          >
            {fileName}
          </a>
          <span className="text-sm text-gray-500">
            {fileSize} • {fileName.split(".").pop()?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileChat;
