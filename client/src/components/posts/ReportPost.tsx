import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import axiosInstance from '../../axios/axios';

// const baseURL = axiosInstance.defaults.baseURL;

function ReportPost({ postId, toggleReportModal }: { postId: string; toggleReportModal: () => void }) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [confirmReport, setConfirmReport] = useState<boolean>(false);

  const reportOptions = [
    'Its spam',
    'Intellectual property violation',
    'Nudity or sexual activity',
    'Hate speech or symbols',
    'Violence or dangerous organizations',
    'Sale of illegal or regulated goods'
  ];

  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;

  const handleReportReason = (option: string) => {
    setSelectedOption(option); // Set the selected report reason
    setConfirmReport(true); // Show the confirmation modal
  };

  const handleConfirmReport = async () => {
    try {
      console.log(selectedOption,";;slfsdiofsduf")
      const response = await axiosInstance.post(`/reportPost`, {
        postId,
        userId,
        reason: selectedOption
      });

      const { data } = response;

      if (data.success) {
        console.log('Post reported successfully.');
      } else {
        console.error('Failed to report post.');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
    }

    setConfirmReport(false); // Hide the confirmation modal after reporting
    setSelectedOption(''); // Reset selected option
    toggleReportModal(); // Close the report modal
  };

  const handleCancelReport = () => {
    setConfirmReport(false); // Hide the confirmation modal
    setSelectedOption(''); // Reset selected option
  };

  return (
    <div>
      {/* Report modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-bold">Report</h2>
            <button onClick={toggleReportModal} className="text-gray-300 hover:text-white">
              X
            </button>
          </div>
          <p className="text-gray-300 mb-4">Why are you reporting this post?</p>
          <ul className="space-y-5">
            {reportOptions.map((option, index) => (
              <li key={index} className="flex items-center">
                <button onClick={() => handleReportReason(option)} className="text-gray-300 hover:text-white flex-grow">
                  {option}
                </button>
                <span className="text-gray-500 mr-2">&#62;</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={handleCancelReport}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            
              <p className="mb-4 text-gray-500">Are you sure you want to report this post?</p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancelReport}
                  className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300"
                >
                  No, cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReport}
                  className="py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                >
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPost;
