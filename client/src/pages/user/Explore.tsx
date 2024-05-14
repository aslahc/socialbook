import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layouts/NavBar';
import NameCard from '../../components/layouts/NameCard';
import SideNav from '../../components/layouts/SideNav';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store/store';
import Post from '../../components/posts/Post';

function Explore() {
  const posts = useSelector((state: RootState) => state.postData.posts);
  const [shuffledPosts, setShuffledPosts] = useState<typeof posts>([]);

  useEffect(() => {
    // Function to shuffle the posts array
    const shuffleArray = (array: typeof posts) => {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
    };

    // Shuffle posts when the 'posts' array changes
    if (posts.length > 0) {
      const shuffled = shuffleArray(posts);
      setShuffledPosts(shuffled);
    }
  }, [posts]); // Re-run the effect when 'posts' array changes
 
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const handlePostClick = async (post:any)=>{
    setSelectedPost(post)
  }
  const handleCloseModal = () => {
    setSelectedPost(null); // Close the modal by resetting the selected post
  };





  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="mt-4 flex ">
        {/* Side Navigation and NameCard (Hidden on Mobile) */}
        <div className="">
          <div className="h-24">
            <NameCard />
          </div>
          <div className="">
            <SideNav />
          </div>
        </div>

        {/* Explore Page Content */}
        <div className="w-full md:w-3/4px-4">
          <div className="bg-white rounded-3xl my-1 mx-5 min-h-screen neumorphism p-6">
            <h1 className="text-3xl font-bold mb-6">Explore</h1>

            {/* Display Shuffled Posts */}
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                320: 1,
                768: 2,
                992: 3,
                1200: 4,
              }}
            >
              <Masonry>
                {shuffledPosts.map((post: any, index: number) => (
                  <div key={index} className="neumorphism">

                   {post.postUrl[0] ? (
                      <img
                        src={post.postUrl[0]}
                        alt="Post"
                        className="w-full h-auto rounded-lg"
                        onClick={() => handlePostClick(post)}
                      />
                    ) : (
                      <div
                      className="p-4 bg-slate-50   rounded-lg cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <p className="text-gray-800 font-medium">{post.caption}</p>
                    </div>
                    )}
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        </div>
      </div>
      {selectedPost  && (
       <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
   <div className="relative p-4 w-full max-w-xl">
   <div className="relative  bg-white rounded-lg shadow sm:p-5">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
            onClick={handleCloseModal}
          >
            &times;
          </button>
        <Post post={selectedPost} />
        </div>
        </div>
        </div>


      )
      
      }
    </div>
  );
}

export default Explore;
