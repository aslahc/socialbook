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
      console.log("req users from ront");

      const response = await axiosInstance.get("/fetchData");
      console.log(" res got users from ront");

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
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Navbar Component */}
      <div className="flex justify-between px-1 py-1">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="sticky left-0 top-0 h-screen hidden md:block">
          <div className="p-4">
            {/* NameCard Component */}
            {/* <NameCard /> */}
          </div>
          <div>
            <SideNav />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-full md:max-w-4xl mx-4 overflow-y-auto">
          {/* AddStory and UserStory Container */}
          <div className="flex flex-col md:flex-row items-center mb-4 justify-between">
            {/* AddStory and UserStory Container */}
            <div className="flex flex-row w-full">
              {/* AddStory Component */}
              <div className="mr-2 md:mr-3">
                <AddStory />
              </div>

              {/* Container for User Stories with Horizontal Scroll */}
              <div className="flex-1 overflow-x-auto">
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
        <div className="hidden lg:block ml-4 w-96 mt-3">
          <UserSuggetion userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default Home;
