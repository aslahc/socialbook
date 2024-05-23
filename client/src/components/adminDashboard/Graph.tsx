import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GraphData {
  monthlyUsers: { _id: number; count: number }[];
  monthlyPosts: { _id: number; count: number }[];
  yearlyUsers: { _id: number; count: number }[];
  yearlyPosts: { _id: number; count: number }[];
}

const Graph: React.FC = () => {
  const [data, setData] = useState<GraphData | null>(null);
  const [filter, setFilter] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    axiosInstance
      .get("/admin/graphdata")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  if (!data) return <div>Loading...</div>;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyLabels = data.monthlyPosts.map((d) => monthNames[d._id - 1]);
  const monthlyUserCounts = data.monthlyUsers.map((d) => d.count);
  const monthlyPostCounts = data.monthlyPosts.map((d) => d.count);

  const yearlyLabels = data.yearlyPosts.map((d) => d._id.toString());
  const yearlyUserCounts = data.yearlyUsers.map((d) => d.count);
  const yearlyPostCounts = data.yearlyPosts.map((d) => d.count);

  const chartData =
    filter === "monthly"
      ? {
          labels: monthlyLabels,
          datasets: [
            {
              label: "Users",
              data:
                monthlyUserCounts.length > 0
                  ? monthlyUserCounts
                  : new Array(monthlyPostCounts.length).fill(0),
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
            },
            {
              label: "Posts",
              data: monthlyPostCounts,
              borderColor: "rgba(153,102,255,1)",
              backgroundColor: "rgba(153,102,255,0.2)",
            },
          ],
        }
      : {
          labels: yearlyLabels,
          datasets: [
            {
              label: "Users",
              data:
                yearlyUserCounts.length > 0
                  ? yearlyUserCounts
                  : new Array(yearlyPostCounts.length).fill(0),
              borderColor: "rgba(54,162,235,1)",
              backgroundColor: "rgba(54,162,235,0.2)",
            },
            {
              label: "Posts",
              data: yearlyPostCounts,
              borderColor: "rgba(255,159,64,1)",
              backgroundColor: "rgba(255,159,64,0.2)",
            },
          ],
        };

  return (
    <div className="graph-container">
      <div className="filter-container">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "monthly" | "yearly")}
          className="filter-select"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: filter === "monthly" ? "Monthly Data" : "Yearly Data",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: filter === "monthly" ? "Month" : "Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Count",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Graph;
