import React from 'react';

function ReportPost({ postId,toggleReportModal }: { postId: string , toggleReportModal: () => void }) {
  const reportOptions = [
    'Its spam',
    'Intellectual property violation',
    'Nudity or sexual activity',
    'Hate speech or symbols',
    'Violence or dangerous organizations',
    'Sale of illegal or regulated goods'
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Report</h2>
          <button
           onClick={toggleReportModal} 
            className="text-gray-300 hover:text-white"
            // onClick={() => setShowModal(false)} // Close modal when X button is clicked
          >
            X
          </button>
        </div>
        <p className="text-gray-300 mb-4">Why are you reporting this post?</p>
        <ul className="space-y-5">
          {reportOptions.map((option, index) => (
            <li key={index} className="flex items-center">
              <button className="text-gray-300 hover:text-white flex-grow">
                {option}
              </button>
              <span className="text-gray-500 mr-2">&#62;</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReportPost;
