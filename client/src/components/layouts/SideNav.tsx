import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiHome,
  FiMessageSquare,
  FiCompass,
  FiFolder,
  FiBell,
  FiPlayCircle,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";

function SideNav() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.userDetails.user);
  return (
    <div className="fixed  bottom-0 ml-4 left-0 right-0 z-10 md:static md:h-auto md:w-auto bg-white rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
      <ul className="py-2 md:py-4 md:px-14 flex flex-row justify-around md:flex-col md:justify-start md:items-start">
        <li
          onClick={() => navigate("/home")}
          className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200   cursor-pointer md:w-full"
        >
          <FiHome />
          <span className="hidden md:inline ml-2">HOME</span>
        </li>
        <li
          onClick={() => navigate("/chat")}
          className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200  cursor-pointer md:w-full"
        >
          <FiMessageSquare />
          <span className="hidden md:inline ml-2">MESSAGE</span>
        </li>
        <li
          onClick={() => navigate("/explore")}
          className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200 cursor-pointer md:w-full rounded"
        >
          <FiCompass />
          <span className="hidden md:inline ml-2">EXPLORE</span>
        </li>
        <li
          onClick={() => navigate("/reel")}
          className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200 cursor-pointer md:w-full"
        >
          <FiPlayCircle />
          <span className="hidden md:inline ml-2">Reels</span>
        </li>
        {/* <li className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200 cursor-pointer md:w-full">
          <FiFolder />
          <span
            onClick={() => navigate("/Collections")}
            className="hidden md:inline ml-2"
          >
            COLLECTION
          </span>
        </li> */}
        <li
          onClick={() => navigate("/Collections")}
          className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200 cursor-pointer md:w-full"
        >
          <FiFolder />

          <span className="hidden md:inline ml-2"> COLLECTION</span>
        </li>
        <li
          onClick={() => navigate("/Notification")}
          className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200 cursor-pointer md:w-full"
        >
          <FiBell />
          <span className="hidden md:inline ml-2">NOTIFICATION</span>
        </li>
        <li
          onClick={() => navigate(`/profile/${user._id}`)}
          className="flex items-center justify-center py-2 md:py-4 text-indigo-500 hover:rounded-lg hover:bg-indigo-200 cursor-pointer md:w-full"
        >
          <FaUser />
          <span className="hidden md:inline ml-2">PROFILE</span>
        </li>
      </ul>
    </div>
  );
}

export default SideNav;
