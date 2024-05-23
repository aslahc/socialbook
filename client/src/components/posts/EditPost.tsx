import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";
import axios from "axios";
import axiosInstance from "../../axios/axios";
import { toast } from "sonner";
import { updatePost } from "../../utils/reducers/PostData";
// const baseURL = axiosInstance.defaults.baseURL;
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
interface EditPostProps {
  postId: string;
  toogleEditPost: () => void;
}

const settings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const EditPost: React.FC<EditPostProps> = ({ postId, toogleEditPost }) => {
  const [caption, setCaption] = useState<string>("");
  const dispatch = useDispatch();

  // Retrieve post data from Redux store
  const postData = useSelector((state: RootState) => state.postData.posts);

  // Find the selected post by postId
  const selectedPost = postData.find((post) => post._id === postId);

  // Initialize the caption state with the current post caption
  useEffect(() => {
    if (selectedPost) {
      setCaption(selectedPost.caption || "");
    }
  }, [selectedPost]);

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value);
  };

  const handleUpdatePost = async () => {
    try {
      console.log("this is the caption iam try ing to send ", caption);
      // Send a PUT request to update the post caption
      const response = await axiosInstance.put(`/editPost/${postId}`, {
        caption,
      });
      console.log("resposdf", response);
      if (response.status === 200) {
        const updatedPost = response.data.editedPost;
        dispatch(updatePost(updatedPost));
        toogleEditPost();
      } else {
        toast.error("error in updating post ");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-lg relative w-full max-w-md">
          <div className="mt-4 mx-8">
            <div className="mb-4">
              <input
                type="text"
                name="caption"
                value={caption}
                onChange={handleCaptionChange}
                placeholder="What's on your mind?"
                className="w-full px-4 py-2 rounded-3xl bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-inner"
              />
            </div>
            {selectedPost?.postUrl &&
              selectedPost?.postUrl.map((url, index) => (
                <img
                  key={index} // Adding a unique key for each image
                  className="w-full h-auto object-contain rounded-2xl shadow-md"
                  src={url}
                  alt="Selected Post Photo"
                />
              ))}

            {/* Input box added below the image */}
            {/* Button for next or close */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={toogleEditPost}
                className="focus:outline-none text-gray-700 bg-gray-200 rounded-lg px-4 py-2 mx-2 shadow-md hover:shadow-lg active:shadow-inner transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handleUpdatePost}
                type="button"
                className="focus:outline-none text-gray-700 bg-gray-200 rounded-lg px-4 py-2 mx-2 shadow-md hover:shadow-lg active:shadow-inner transition-all duration-200"
              >
                Update Caption
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
