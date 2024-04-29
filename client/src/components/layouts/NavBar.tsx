import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from '../../utils/store/store';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const usersData = useSelector((state: RootState) => state.users.users);

  // Function to filter users based on search query
  const filteredUsers = usersData.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
console.log(filteredUsers,"filterd usre")

  // Function to handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (searchQuery.trim() !== " ") { // Check if searchQuery has any non-whitespace characters
      setShowModal(true);
    }else{
      setShowModal(false);

    }
  };

  // Function to handle search subm
  const handleSearchSubmit = () => {
    setShowModal(true);
  };
 
  const handleUserProfileClick = (user: any) => {
    navigate(`/user-Profile/${user}`); // Navigate to the user profile page
  };
  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-indigo-400">
      <div className="flex items-center space-x-2">
        <span className="text-xl text-white font-bold">socialBook</span>
      </div>
      <div className="relative w-full max-w-screen-sm">
        <input
          type="text"
          className="rounded-lg pl-8 pr-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 w-full bg-gray-700 border border-transparent"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
          onClick={handleSearchSubmit}
        >
          Search
        </button>
        {showModal && (
          <div className="absolute top-full left-0 w-full mt-1  max-w-2xl mx-auto">
            <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                 serach result 
                </h3>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  View all
                </a>
              </div>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map(user => (
                    
                    <li key={user._id.toString()} onClick={() => handleUserProfileClick(user._id)} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={user.profileimg} 
                            alt={`${user.username} avatar`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {/* ${customer.amount} */} follow
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-transparent hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        Logout
      </button>
    </nav>
  );
}  

export default Navbar;
