import React from 'react';

function TotalReport() {
  return (
    <div className="flex flex-wrap justify-center gap-8 p-8 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">Total Users</div>
        <div className="text-5xl font-semibold text-gray-800">1,1300</div>
        <div className="text-gray-600 mt-2">users</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">Total Posts</div>
        <div className="text-5xl font-semibold text-gray-800">122,120</div>
        <div className="text-gray-600 mt-2">posts</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">Total Active Users</div>
        <div className="text-5xl font-semibold text-gray-800">13,420</div>
        <div className="text-gray-600 mt-2">active users</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">Total Likes</div>
        <div className="text-5xl font-semibold text-gray-800">1,1300</div>
        <div className="text-gray-600 mt-2">likes</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">Total Comments</div>
        <div className="text-5xl font-semibold text-gray-800">1,1300</div>
        <div className="text-gray-600 mt-2">comments</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">Total Reported Posts</div>
        <div className="text-5xl font-semibold text-gray-800">123</div>
        <div className="text-gray-600 mt-2">reported posts</div>
      </div>
    </div>
  );
}

export default TotalReport;