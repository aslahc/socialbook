import { Video, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";
interface VideoCallModalProps {
  show: boolean;
  onHide: () => void;
  onAccept: () => void;
  onReject: () => void;
  caller: {
    name: string;
    profile: string;
  };
}
const Ringtone = "/digital_ringer.mp3";

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  show,
  onHide,
  onAccept,
  onReject,
  caller,
}) => {
  const users = useSelector((state: RootState) => state.users.users);

  // Find the user with the matching ID
  const userDetails = users.find((user) => user.username === caller.name);
  // useEffect(() => {
  //   const audio = new Audio(Ringtone);
  //   if (show) {
  //     audio.play();
  //   }
  //   return () => {
  //     audio.pause();
  //     audio.currentTime = 0;
  //   };
  // }, [show]);

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 mt-14 rounded-lg shadow-lg">
            <div className="flex flex-col gap-4 items-center justify-center mb-4">
              <span className="text-lg font-semibold">Incoming call from</span>
              <img
                src={userDetails?.profileimg || "/download.jpeg"}
                alt={caller.name}
                className="w-12 h-12 rounded-full"
              />
              <span className="text-lg font-semibold">{caller.name}</span>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onReject}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <div className="flex gap-3 items-center">
                  <X />
                  Reject
                </div>
              </button>
              <button
                onClick={onAccept}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 animate-shiver"
              >
                <div className="flex gap-3 items-center">
                  <Video />
                  Accept
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCallModal;
