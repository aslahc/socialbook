import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import axiosInstance from '../../axios/axios';

const baseURL = axiosInstance.defaults.baseURL;

interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileimg:string
    // Include other properties of the user object if needed
  };
  comment: string;
  createdAt: Date;

}

const CommentComponent: React.FC<{ postId: string }> = ({ postId }) => {
  const [commentInput, setCommentInput] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${baseURL}/comment/${postId}`);
        const { data } = response;

        if (data.comments) {
          // Update the comments state with the fetched comments data
          setComments(data.comments);
        } else {
          console.error('No comments found.');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);
  
  const handleCommentSubmit = async () => {
    if (commentInput.trim() !== '') {
      const newComment: Comment = {
        _id: '',
        userId,
        comment: commentInput,
        createdAt: new Date(),
      };

      try {
        const response = await axios.post(`${baseURL}/postComment`, {
          newComment,
          postId,
        });

        const { data } = response;

        if (data.success) {
          const savedComment: Comment = data.commentSaved;
          // Update comments state to include the new comment
          setComments([...comments, savedComment]);
          setCommentInput(''); // Clear the comment input field after submission
          console.log('Comment saved successfully:', savedComment);
        } else {
          console.error('Error: Comment was not saved successfully');
        }
      } catch (error) {
        console.error('Error occurred while saving comment:', error);
      }
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await axios.delete(`${baseURL}/deleteComment/${commentId}`);
      const { data } = response;

      if (data.success) {
        // Filter out the deleted comment from the comments state
        const updatedComments = comments.filter((comment) => comment._id !== commentId);
        setComments(updatedComments);
        console.log('Comment deleted successfully:', commentId);
      } else {
        console.error('Error: Comment deletion failed');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-2xl shadow-inner dark:bg-gray-800 sm:p-8">
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="w-full px-3 py-2 placeholder-gray-500 bg-gray-100 rounded-lg shadow-inner dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 transition-all duration-200"
        />
  
     {commentInput && (    <button 
          onClick={handleCommentSubmit}
          type="button" className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
<svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
</svg>
<span className="sr-only">Icon description</span>
</button>
 ) } 
      </div>
      <div className="max-h-60 overflow-y-auto">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="p-2 bg-gray-100 rounded-lg shadow-inner dark:bg-gray-700 mb-2 flex justify-between items-start"
          >
            <div className="flex items-center">
              <img
                src={comment.userId.profileimg}
                alt="User Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {/* Display the username of the comment author */}
                  {comment.userId.username} 
                </span>
                <span className="ml-1 text-gray-600 dark:text-gray-400 text-sm">
                  {/* Format and display the comment creation date */}
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                </span>
                <p className="ml-1 text-gray-800 dark:text-gray-200 mt-1">
                  {/* Display the comment text */}
                  {comment.comment}
                </p>
              </div>
            </div>
            {/* Buttons for deleting or editing comments (to be implemented) */}
            <div className="flex items-center">
           
              <button    onClick={() => handleDeleteComment(comment._id)}  
              className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200">
                {/* Edit button (to be implemented) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentComponent;
