import React from "react";
import Navbar from "../../components/layouts/NavBar";
import NameCard from "../../components/layouts/NameCard";
import SideNav from "../../components/layouts/SideNav";
import ReelPost from "../../components/reel/ReelPost";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";
import CreateReel from "../../components/reel/CreateReel";

function Reels() {
  const posts = useSelector((state: RootState) => state.postData.posts);
  const postData = posts.filter((post) => post.type === "reel");

  return (
    <div>
      <div className="bg-gray-100 min-h-screen max-h-screen">
        <Navbar />

        <div className="mt-4 flex ">
          <div className="">
            <div className="">
              <SideNav />
            </div>
          </div>

          <div className="w-full md:w-3/4px-4">
            <div className="bg-white rounded-3xl  mx-5 min-h-screen neumorphism p-6">
              <h1 className="text-3xl font-bold flex-1 text-indigo-500">
                Reels
              </h1>
              <div className="mt-1">
                <CreateReel />
              </div>

              <div className="relative   h-screen overflow-y-auto">
                {postData &&
                  postData.map((post) => (
                    <div key={post._id} className="mb-4">
                      <ReelPost post={post} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reels;
