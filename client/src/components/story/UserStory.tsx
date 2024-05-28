import React, { useState } from "react";
import ViewStory from "./ViewStory";

interface Istory {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileimg: string;
  };
  stories: {
    storyImg: string;
    views: string[];
    createOn: string;
    expireOn: string;
    _id: string;
  }[];
}

interface UserStoryProps {
  story: Istory;
}

function UserStory({ story }: UserStoryProps) {
  const [showStory, setShowStory] = useState<boolean>(false);

  return (
    <div className="flex gap-4 mb-4">
      <div
        className="relative bg-white rounded-lg shadow-md overflow-hidden"
        style={{
          maxWidth: "150px",
          maxHeight: "200px",
          width: "150px",
          height: "200px",
          boxShadow:
            "5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        <img
          onClick={() => {
            setShowStory(!showStory);
          }}
          src={story.userId.profileimg || "/download.jpeg"}
          alt=""
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-4 left-4 text-indigo-400 font-medium">
          {story.userId.username}
        </span>
      </div>
      {showStory && (
        <ViewStory setShowStory={setShowStory} storyData={[story]} />
      )}
    </div>
  );
}

export default UserStory;
