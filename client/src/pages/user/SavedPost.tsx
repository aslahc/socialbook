import React, { useState, useEffect, FormEvent } from 'react';
import SideNav from '../../components/layouts/SideNav';
import NameCard from '../../components/layouts/NameCard';
import Navbar from '../../components/layouts/NavBar';
import axiosInstance from '../../axios/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../../utils/reducers/userDetails';
import Post from '../../components/posts/Post';
import { RootState } from '../../utils/store/store';
import { IPost } from '../../types/types';

interface UserState {
  userDetails: {
    user: {
      savePostCategory: string[] | undefined; 
      _id: string;
    };
  };
}

interface PostData {
  _id: string;
  title: string;
  content: string;
  // Add other fields as necessary
}

const SavedPost: React.FC = () => {
  const dispatch = useDispatch();

  const userData = useSelector((state: UserState) => state.userDetails.user);
  const userId = userData._id;
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<any>([]);
console.log(filteredPosts,"q")
  const posts = useSelector((state: RootState) => state.postData.posts);

  const fetchPostsByCategory = async (category: string) => {
    try {
      const response = await axiosInstance.get(`/Savedposts/${userId}/${category}`);
      console.log("res from j",response)
      const fetchedPosts = response.data.posts;
      console.log("fet",fetchedPosts)
      const filteredPostsData = posts.filter(post => fetchedPosts.some((fp: { post: string; }) => fp.post === post._id));
      setFilteredPosts(filteredPostsData);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
    }
  };

  const handleCreateCategory = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (!categoryName.trim()) {
        console.log("Category name can't be empty");
        return;
      }

      const response = await axiosInstance.post(`/createCategory`, { userId, categoryName }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        dispatch(setUserDetails(response.data.userData));
        setCreateModal(false);
        setCategoryName('');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  useEffect(() => {
    if (userData.savePostCategory && userData.savePostCategory.length > 0) {
      setSelectedCategory(userData.savePostCategory[0]); // Set initial category if available
    }
  }, [userData.savePostCategory]);

  useEffect(() => {
    if (selectedCategory) {
      fetchPostsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="mt-4 flex">
        <div className="">
          <div className="h-24">
            <NameCard />
          </div>
          <div className="">
            <SideNav />
          </div>
        </div>

        <div className="w-full md:w-3/4 px-4">
          <div className="bg-white rounded-3xl my-1 mx-5 min-h-screen neumorphism p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Collections</h1>
              <div className="relative">
              {userData.savePostCategory && userData.savePostCategory.length > 0 ? (
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="appearance-none rounded-md bg-gray-200 py-2 px-4 pr-8 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select Category</option>
    {userData.savePostCategory.map((category: string) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
) : (
  <p>No categories available</p>
)}

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M14.707 7.293a1 1 0 0 0-1.414 0L10 10.586 6.707 7.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 0-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <button onClick={() => setCreateModal(true)} className="bg-indigo-700 text-white px-4 py-2 rounded shadow-md">
              Create category
            </button>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold">Posts in {selectedCategory}</h2>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post: IPost) => (
                  <div key={post._id} className="mb-4">
                    <Post post={post} />
                  </div>
                ))
              ) : (
                <div className="neumorphism-placeholder p-8 rounded-lg shadow-neumorphism">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="https://www.cortfurnitureoutlet.com/assets/images/no-image.png"
                      alt="No posts found"
                      className="neumorphism-image w-48 h-48 mb-4"
                    />
                    <p className="text-gray-500 text-center">
                      There are no posts available for the selected category.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {createModal && (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">Create New Category</h3>
                <button
                  onClick={() => setCreateModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleCreateCategory}>
                <div className="grid gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Create Category
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPost;
