import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";

interface ReportData {
  totalUsers: number;
  totalPosts: number;
  totalActiveUsers: number;
  totalReels: number;
  totalComments: number;
  totalReportedPosts: number;
}

function TotalReport() {
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/admin/totalreport")
      .then((response) => {
        setReportData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the report data!", error);
      });
  }, []);

  if (!reportData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">
          Total Users
        </div>
        <div className="text-5xl font-semibold text-gray-800">
          {reportData.totalUsers}
        </div>
        <div className="text-gray-600 mt-2">users</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">
          Total Posts
        </div>
        <div className="text-5xl font-semibold text-gray-800">
          {reportData.totalPosts}
        </div>
        <div className="text-gray-600 mt-2">posts</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">
          Total Active Users
        </div>
        <div className="text-5xl font-semibold text-gray-800">
          {reportData.totalActiveUsers}
        </div>
        <div className="text-gray-600 mt-2">active users</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">
          Total Likes
        </div>
        <div className="text-5xl font-semibold text-gray-800">
          {reportData.totalReels}
        </div>
        <div className="text-gray-600 mt-2">likes</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">
          Total Comments
        </div>
        <div className="text-5xl font-semibold text-gray-800">
          {reportData.totalComments}
        </div>
        <div className="text-gray-600 mt-2">comments</div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 text-center">
        <div className="text-xl font-bold text-indigo-600 mb-4">
          Total Reported Posts
        </div>
        <div className="text-5xl font-semibold text-gray-800">
          {reportData.totalReportedPosts}
        </div>
        <div className="text-gray-600 mt-2">reported posts</div>
      </div>
    </div>
  );
}

export default TotalReport;
