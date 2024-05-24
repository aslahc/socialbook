import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../axios/axios";
import NameCard from "../../components/layouts/NameCard";
import AdminSIdeBar from "../../components/layouts/AdminSIdeBar";
import AdminNavbar from "../../components/layouts/AdminNavbar";
import AdminManageReport from "../../components/posts/AdminManageReport";
import AdminLogoCard from "../../components/layouts/AdminLogoCard";

const baseURL = axiosInstance.defaults.baseURL;

function ReportPostManage() {
  return (
    <div>
      <div className="mt-4 flex">
        <div className="w-64">
          <div className="">
            {/* Include the NameCard component */}
            <AdminLogoCard />
          </div>

          <div className="mt-4">
            {/* Include the AdminSIdeBar component */}
            <AdminSIdeBar />
          </div>
        </div>

        <div className="w-full">
          {/* Include the AdminNavbar component */}
          <AdminNavbar />
          <AdminManageReport />
        </div>
      </div>
    </div>
  );
}

export default ReportPostManage;
