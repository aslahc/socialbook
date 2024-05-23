import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/layouts/NavBar";
import NameCard from "../../components/layouts/NameCard";
import SideNav from "../../components/layouts/SideNav";
import CreatePost from "../../components/posts/CreatePost";
import Post from "../../components/posts/Post";
import axiosInstance from "../../axios/axios";
import { setUsers } from "../../utils/reducers/userData";
import { setPost } from "../../utils/reducers/PostData";
import { RootState } from "../../utils/store/store";
import { IPost } from "../../types/types";
import AddStory from "../../components/story/AddStory";
import { setStory } from "../../utils/reducers/StoryData";
import UserStory from "../../components/story/UserStory";
import UserSuggetion from "../../components/Users/UserSuggetion";
import AdminLogoCard from "../../components/layouts/AdminLogoCard";
import CreateReel from "../../components/reel/CreateReel";

const baseURL = axiosInstance.defaults.baseURL;

function Home() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userDetails.user || "");
  const userId = userData._id;

  const posts = useSelector((state: RootState) => state.postData.posts);
  const postData = posts.filter((post) => post.type === "image");
  const stories = useSelector(
    (state: RootState) => state.StoryData.story || []
  );
  const storyData = Array.isArray(stories)
    ? stories.filter((story) => story.userId._id !== userId)
    : [];

  const storiesContainerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const cardWidth = 160;
  // const visibleStories = 2; // Number of stories to show at a time
  // const containerWidth = cardWidth * visibleStories;

  // Function to fetch posts
  const fetchPosts = async (): Promise<void> => {
    try {
      const response = await fetch(`${baseURL}/fetchPost`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const responseData = await response.json();

      const sortedPosts = responseData.postData.sort(
        (a: IPost, b: IPost) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      dispatch(setPost(sortedPosts));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get("/fetchData");
      dispatch(setUsers(response.data.usersData));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchStory = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get("/fetchStoryData");
      dispatch(setStory(response.data.storyData));
    } catch (error) {
      console.error("Error:", error);
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
    <div className="flex flex-col h-screen">
      {/* Navbar Component */}
      <div className="flex justify-between px-1 py-1">
        {/* Admin Logo Card */}
        {/* <div className="w-1/3">
          <AdminLogoCard />
        </div> */}

        {/* Navbar */}
        {/* <div className="w-9/12 fixed top-0 right-0 flex justify-end"> */}
        <Navbar />
        {/* </div> */}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 mt-4">
        {/* Sidebar */}
        <div className="sticky left-0 top-0 h-screen">
          {/* NameCard Component */}

          {/* SideNav Component */}
          <div>
            <SideNav />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl ml-4">
          {/* AddStory and UserStory Container */}
          <div className="flex items-center mb-4 justify-between ">
            {/* AddStory Component */}
            <div className="mr-3">
              <AddStory />
            </div>

            {/* Container for User Stories with Horizontal Scroll */}
            <div className="relative w-[550px] overflow-x-auto">
              <div
                className="flex"
                ref={storiesContainerRef}
                style={{
                  width: `${storyData.length * cardWidth}px`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                {/* User Stories Rendering */}
                {storyData &&
                  storyData.map((story, index) => (
                    <div
                      key={story._id}
                      className="inline-flex"
                      style={{ width: `${cardWidth}px`, gap: "19px" }}
                    >
                      <UserStory story={story} />
                    </div>
                  ))}
              </div>

              {/* Horizontal Scrollbar */}
              <div className="overflow-x-auto">
                <div
                  className="scrollbar-track scrollbar-thumb-rounded scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                  style={{ width: `${storyData.length * cardWidth}px` }}
                />
              </div>
            </div>
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

        {/* UserSuggestion Component (Aligned to the Right) */}
        <div className="hidden sm:block ml-auto">
          <UserSuggetion userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default Home;
