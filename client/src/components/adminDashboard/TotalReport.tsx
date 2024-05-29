import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
    <div className="flex flex-wrap justify-center gap-8 bg-gray-100 p-4">
      {Object.entries(reportData).map(([key, value]) => (
        <div className="bg-white rounded-lg shadow-lg p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-center">
          <div className="text-xl font-bold text-indigo-600 mb-4">
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </div>
          <div style={{ width: 80, height: 80, margin: "0 auto" }}>
            <CircularProgressbar
              value={value}
              text={`${value}`}
              styles={buildStyles({
                pathColor: `#4f46e5`,
                textColor: "#4f46e5",
              })}
            />
          </div>
          <div className="text-gray-600 mt-2">
            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TotalReport;
