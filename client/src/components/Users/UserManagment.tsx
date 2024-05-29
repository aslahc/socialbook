import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../../utils/reducers/userData";
import axiosInstance from "../../axios/axios";
import { User } from "../../types/types";
import { RootState } from "../../utils/store/store";
import { Link } from "react-router-dom";

function UserManagment() {
  const dispatch = useDispatch();
  const [users, setUsersState] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // Set the desired number of users per page

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get(`/fetchData`);
      console.log("Response:", response.data.usersData);
      dispatch(setUsers(response.data.usersData));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleBlockUser = async (user: any) => {
    try {
      console.log(user);
      await axiosInstance
        .put(`/admin/block`, { userId: user._id, isBlock: !user.isBlock })
        .then((res) => console.log("user blocked successfully"));
      fetchUser();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const usersData = useSelector((state: RootState) => state.users.users);
  console.log("use te data kitteeeeeeeeeyee", usersData);

  // Calculate the number of pages
  const totalPages = Math.ceil(usersData.length / usersPerPage);

  // Get the current page's users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersData.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="w-auto m-9 rounded-3xl overflow-x-auto">
        <table className="min-w-full bg-white font-sans">
          <thead className="whitespace-nowrap">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black sm:table-cell hidden">
                phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black">
                status
              </th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {currentUsers.map((user, index) => (
              <tr key={index} className="odd:bg-blue-50">
                <td className="px-6 py-3 text-sm">
                  <div className="flex items-center cursor-pointer">
                    <img
                      src={user.profileimg || "/download.jpeg"}
                      className="w-9 h-9 rounded-full shrink-0"
                      alt="Profile"
                    />
                    <div className="ml-4">
                      <p className="text-sm text-black">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm sm:table-cell hidden">
                  {user.phone}
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => toggleBlockUser(user)}
                    className={`mr-4 ${
                      user.isBlock ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.isBlock ? "Unblock User" : "Block User"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default UserManagment;
