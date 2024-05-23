/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios/axios";

// Extract baseURL from axiosInstance.defaults
// const baseURL = axiosInstance.defaults.baseURL;

interface Report {
  postId: {
    postUrl: string;
  };
  reason: string;
  isBlocked: boolean; // Corrected property name to 'isBlocked'
}

// Define type for the component state
type ReportState = Report[];
function AdminManageReport() {
  const [reports, setReports] = useState<ReportState>([]);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get(`/admin/fetchReport`);

      if (response.status === 200) {
        setReports(response.data.reportedPost || []); // Handle potential absence of data
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleBlockPost = async (report: Report) => {
    try {
      const updatedIsBlocked = !report.isBlocked;

      // Send POST request to block/unblock the post
      const response = await axiosInstance.post(`/admin/blockPost`, {
        postId: report.postId,
        isBlocked: updatedIsBlocked,
      });

      // Check if the request was successful (status 200)
      if (response.status === 200) {
        // Update local state to reflect the change
        setReports((prevReports) =>
          prevReports.map((prevReport) =>
            prevReport.postId === report.postId
              ? { ...prevReport, isBlocked: updatedIsBlocked }
              : prevReport
          )
        );

        // Optionally refetch updated data from server
        // This can be useful if you want to ensure the latest data is displayed
        //   fetchReport();
      } else {
        console.log("Failed to update block status");
      }
    } catch (error) {
      console.log("Error toggling block status:", error);
      // You can add more detailed error handling here
    }
  };

  return (
    <div>
      <div className="overflow-x-auto m-9 rounded-3xl">
        <table className="min-w-full bg-white font-sans">
          <thead className="whitespace-nowrap">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                Post
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                Block/Unblock
              </th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {reports.map((report, index) => (
              <tr className="odd:bg-blue-50" key={index}>
                <td className="px-6 py-3 text-sm">
                  <img
                    className="max-h-32 max-w-32"
                    src={report.postId.postUrl} // Assuming postId is a URL string
                    alt="Post Image"
                  />
                </td>
                <td className="px-6 py-3 text-sm">{report.reason}</td>
                <td className="px-6 py-3">
                  <button
                    className={`mr-4 ${
                      report.isBlocked ? "text-red-500" : "text-green-500"
                    }`}
                    onClick={() => toggleBlockPost(report)}
                  >
                    {report.isBlocked ? "Unblock Post" : "Block Post"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminManageReport;
