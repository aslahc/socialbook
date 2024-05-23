import React from "react";
import { useSelector } from "react-redux";
function NameCard() {
  const userData = useSelector((state: any) => state.userDetails.user || "");
  const userName = userData.username;
  const profileIMg = userData.profileimg;

  return (
    <div>
      <div className="max-w-xs md:max-w-64 ml-4 bg-white rounded-xl overflow-hidden shadow-lg hidden md:block">
        {/* <img className="w-full" // src={imageUrl} alt={name} /> */}
        <div className="px-6 py-5 text-center">
          <div className="font-bold text-xl mb-2 text-indigo-500 ">
            {userName}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NameCard;
