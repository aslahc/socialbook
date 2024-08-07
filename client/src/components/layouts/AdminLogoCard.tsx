import React from "react";

function AdminLogoCard() {
  return (
    <div>
      <div className="hidden md:block">
        <div className="max-w-2xl md:max-w-64 ml-4 bg-indigo-500 rounded-3xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 text-center">
            <div className="font-bold text-xl mb-2 text-white">socialBook</div>
          </div>
          <div className="px-6 py-4 bg-indigo-600 rounded-3xl shadow-inner mx-4 mb-4"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogoCard;
