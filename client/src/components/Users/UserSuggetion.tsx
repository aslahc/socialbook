import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store/store';
import { User } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import useFollowUser from '../../utils/firendMange/firendManage'


interface UserSuggestionProps {
  userId: string;
}

const UserSuggestion: React.FC<UserSuggestionProps> = ({ userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { followUserAction, unfollowUserAction } = useFollowUser()

  const users = useSelector((state: RootState) => state.users.users) as User[];

 

  const usersData = useMemo(() => {

    return users.filter((user) => !user.followers || !user.followers.includes(userId));
  }, [users, userId]);
  

  // Function to generate random indices for user selection
  const getRandomUserIndices = (totalUsers: number, count: number): number[] => {
    const indices: number[] = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * totalUsers);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  };

  // Get 6 random user indices
  const randomUserIndices = getRandomUserIndices(usersData.length, 6);

  // Filter usersData based on random indices
  const randomUsers = randomUserIndices.map((index) => usersData[index]);

  // Function to handle following a user
  const handleFollowUser = async (Id: string) => {

    try {
      console.log("enterd to folllow user ")
      await followUserAction(Id, userId, );
    } catch (error) {
      console.log('Failed to follow the user:', error);
    }
  };

  // Function to navigate to user profile
  const handleSuggestionUser = (userId: string) => {
    try {
      navigate(`/user-profile/${userId}`); // Navigate to the user profile page
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative max-w-2xl mr-4">
      <div className="bg-white  rounded-lg shadow-lg p-4 neumorphism">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-indigo-500 ">Friend Suggestions</h3>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 ">
            {randomUsers.map((user) => (
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
                    
                    className="text-sm font-medium text-gray-900 truncate dark:text-indigo-500 ">{user.username}
                    
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</p>
                  </div>
                  <div
                    className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-indigo-500  neumorphism px-2 py-1 rounded-md"
                    onClick={() => handleFollowUser(user._id)}
                  >
                    Follow
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserSuggestion;