import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store/store';

interface User {
  userId: string;
  username: string;
  profilePicture: string;
}

interface LikedUserListProps {
  handleLikedUserList: () => void;
  Like: string[];
}

const LikedUserList: React.FC<LikedUserListProps> = ({ handleLikedUserList, Like }) => {
  // Get the users data from the Redux store
  const usersData = useSelector((state: RootState) => state.users.users);

  // Filter the usersData to find the liked users
  const likedUsers = usersData.filter(user => Like.some(like => like === user._id));
console.log("ingene liked user",likedUsers)
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg min-w-80 max-w-6xl shadow-2xl dark:bg-gray-800 sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Liked Users</h2>
        <button
          onClick={handleLikedUserList}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {likedUsers.length >= 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
          {likedUsers.map((user) => (
            <li key={user._id} className="flex items-center py-3">
              <img
                src={user.profileimg}
                alt={`${user.username}'s profile`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <span className="text-indigo-500 font-semibold">{user.username}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No liked users found.</p>
      )}
    </div>
  );
};

export default LikedUserList;
