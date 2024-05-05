import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/layouts/NavBar';
import NameCard from '../../components/layouts/NameCard';
import SideNav from '../../components/layouts/SideNav';
import CreatePost from '../../components/posts/CreatePost';
import Post from '../../components/posts/Post';
import axiosInstance from '../../axios/axios';
import { setUsers } from '../../utils/reducers/userData';
import { setPost } from '../../utils/reducers/PostData';
import { RootState } from '../../utils/store/store';
import { IPost } from '../../types/types';
import AddStory from '../../components/story/AddStory';
import { setStory } from '../../utils/reducers/StoryData';
import UserStory from '../../components/story/UserStory';

const baseURL = axiosInstance.defaults.baseURL;

function Home() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id

  const postData = useSelector((state: RootState) => state.postData.posts);
  const stories = useSelector((state: RootState) => state.StoryData.story || []);
  const storyData = Array.isArray(stories) ? stories.filter((story) => story.userId._id !== userId) : [];


  console.log("from stoory datttettetet",storyData)


  const storiesContainerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardWidth = 200;
  const visibleStories = 4; // Number of stories to show at a time
  const containerWidth = cardWidth * visibleStories;

  // Function to fetch posts
  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await fetch(`${baseURL}/fetchPost`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const responseData = await response.json();

      const sortedPosts = responseData.postData.sort((a: IPost, b: IPost) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      dispatch(setPost(sortedPosts));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get('/fetchData');
      dispatch(setUsers(response.data.usersData));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStory = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get('/fetchStoryData');
      dispatch(setStory(response.data.storyData));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
    fetchStory();
  }, []);

  const scrollStories = (scrollOffset: number) => {
    const container = storiesContainerRef.current;
    if (container) {
      container.style.transform = `translateX(-${scrollOffset}px)`;
    }
  };

  const handleScrollLeft = () => {
    if (currentSlide > 0) {
      const newSlide = currentSlide - 1;
      setCurrentSlide(newSlide);
      const scrollOffset = newSlide * cardWidth;
      scrollStories(scrollOffset);
    }
  };

  const handleScrollRight = () => {
    if (currentSlide < storyData.length - 1) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);
      const scrollOffset = newSlide * cardWidth;
      scrollStories(scrollOffset);
    }
  };

  return (
    <div className="">
      <div>
        <div className="sticky top-0">
          <Navbar />
        </div>

        <div className="mt-4 flex">
          {/* Sidebar */}
          <div className="sticky left-0 top-1 h-screen">
            <div className="h-24">
              <NameCard />
            </div>
            <div>
              <SideNav />
            </div>
          </div>

          <div className="flex-1 max-w-4xl ml-4 ">
            {/* AddStory, UserStory Container, and Friend Suggestion */}
            <div className="flex items-center mb-4 gap-6 justify-between ">
              <AddStory />
             
              {/* Container for User Stories with Horizontal Scroll */}
              <div className="relative w-[800px] overflow-hidden">
                <div
                  className="flex"
                  ref={storiesContainerRef}
                  style={{
                    width: `${storyData.length * cardWidth}px`,
                    transition: 'transform 0.3s ease-in-out',
                  }}
                >
                  {storyData &&
                    storyData.map((story, index) => (
                      <div
                        key={story._id}
                        className={`inline-flex`}
                        style={{ width: `${cardWidth}px` }}
                      >
                        <UserStory story={story} />
                      </div>
                    ))}
                </div>
              </div>

              {/* Scroll Buttons */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                onClick={handleScrollLeft}
                disabled={currentSlide === 0}
              >
                {'<'}
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                onClick={handleScrollRight}
                disabled={currentSlide >= storyData.length - 4}
              >
                {'>'}
              </button>
            </div>

            {/* Create Post Component */}
            <div className="mt-4">
              <CreatePost />
            </div>

            {/* Display Posts */}
            <div className="mt-4">
              {postData &&
                postData.map((post) => (
                  <div key={post._id} className="mb-4">
                    <Post post={post} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;