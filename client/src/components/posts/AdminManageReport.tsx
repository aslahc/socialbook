/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios/axios";

interface Report {
  postId: { postUrl: string };
  reason: string;
  isBlocked: boolean;
}

type ReportState = Report[];

function AdminManageReport() {
  const [reports, setReports] = useState<ReportState>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5; // Set the desired number of reports per page

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get(`/admin/fetchReport`);
      if (response.status === 200) {
        setReports(response.data.reportedPost || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleBlockPost = async (report: Report) => {
    try {
      const updatedIsBlocked = !report.isBlocked;
      const response = await axiosInstance.post(`/admin/blockPost`, {
        postId: report.postId,
        isBlocked: updatedIsBlocked,
      });

      if (response.status === 200) {
        setReports((prevReports) =>
          prevReports.map((prevReport) =>
            prevReport.postId === report.postId
              ? { ...prevReport, isBlocked: updatedIsBlocked }
              : prevReport
          )
        );
      } else {
        console.log("Failed to update block status");
      }
    } catch (error) {
      console.log("Error toggling block status:", error);
    }
  };

  // Calculate the number of pages
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  // Get the current page's reports
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="overflow-x-auto m-9 rounded-3xl">
      <div className="w-full overflow-x-auto">
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
            {currentReports.map((report, index) => (
              <tr className="odd:bg-blue-50" key={index}>
                <td className="px-6 py-3 text-sm">
                  {report.postId.postUrl ? (
                    <img
                      className="max-h-32 max-w-32 sm:max-h-24 sm:max-w-24 md:max-h-32 md:max-w-32"
                      src={report.postId.postUrl}
                      alt="Post Image"
                    />
                  ) : (
                    <p>{report.postId.postUrl}</p>
                  )}
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
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default AdminManageReport;
