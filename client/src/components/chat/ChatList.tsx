import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";
import { User } from "../../types/types";

interface ChatListProps {
  onUserSelect: (user: User) => void; // Callback function for user selection
}

function ChatList({ onUserSelect }: ChatListProps) {
  const userData = useSelector((state: any) => state.userDetails.user || "");
  const userId = userData._id;
  const usersData = useSelector((state: RootState) => state.users.users);
  const users = usersData.filter((user) => user._id !== userId);

  return (
    <div className="bg-gray-100 py-4 min-h-screen max-h-screen overflow-y-auto  custom-scroller">
      {" "}
      {/* Add a fixed height and overflow-y: auto */}
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onUserSelect(user)}
          className="flex flex-row items-center bg-white rounded-2xl mx-4 my-2 p-4 transition duration-300 hover:bg-indigo-50"
        >
          <div className="w-1/4 flex justify-center">
            <div className="relative">
              <img
                src={user.profileimg || "https://via.placeholder.com/150"}
                className="object-cover h-16 w-16 rounded-full"
                alt=""
              />
            </div>
          </div>
          <div className="w-3/4 ml-4">
            <div className="text-lg font-semibold text-indigo-400">
              {user.username}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
