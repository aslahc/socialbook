import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFollowUser from '../../utils/firendMange/firendManage';
import axiosInstance from '../../axios/axios';
import { User } from '../../types/types';

interface UserSuggestionProps {
  userId: string;
}

const UserSuggestion: React.FC<UserSuggestionProps> = ({ userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { followUserAction } = useFollowUser();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axiosInstance.get(`/suggestions/${userId}`);
          console.log("responese from backend",response)
        if (Array.isArray(response.data.suggestions)) {
          setSuggestedUsers(response.data.suggestions);
        } else {
          console.error('API response is not an array:', response.data);
          setSuggestedUsers([]);
        }
      } catch (error) {
        console.error('Failed to fetch suggested users:', error);
      }
    };

    fetchSuggestedUsers();
  }, [userId]);

  // Function to handle following a user
  const handleFollowUser = async (Id: string) => {
    try {
      await followUserAction(Id, userId);
    } catch (error) {
      console.log('Failed to follow the user:', error);
    }
  };

  // Function to navigate to user profile
  const handleSuggestionUser = (userId: string) => {
    try {
      navigate(`/user-profile/${userId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative max-w-2xl mr-4">
      <div className="bg-white rounded-lg shadow-lg p-4 neumorphism">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-indigo-500">
            Friend Suggestions
          </h3>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <li
                  key={user._id.toString()}
                  className="py-3 sm:py-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full neumorphism"
                        src={user.profileimg || '/download.jpeg'}
                        alt={`${user.username} avatar`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        onClick={() => handleSuggestionUser(user._id)}
                        className="text-sm font-medium text-gray-900 truncate dark:text-indigo-500"
                      >
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <div
                      className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-indigo-500 neumorphism px-2 py-1 rounded-md"
                      onClick={() => handleFollowUser(user._id)}
                    >
                      Follow
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-3 sm:py-4">
                <div className="text-center text-gray-500">
                  No friend suggestions available
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserSuggestion;
