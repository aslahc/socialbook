import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axios';
import { useSelector } from 'react-redux';

interface User {
  _id: string;
  username: string;
  profileimg: string;
}

interface ReplyComment {
  _id: string;
  userId: User;
  comment: string;
  createdAt: Date;
}

interface Comment {
  _id: string;
  userId: User;
  comment: string;
  createdAt: Date;
  replyComments: ReplyComment[];
}

interface CommentComponentProps {
  postId: string;
  toggleCommentModal: () => void;
}

    const CommentComponent: React.FC<CommentComponentProps> = ({ postId ,toggleCommentModal }) => {
  const [commentInput, setCommentInput] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [replyingToComment, setReplyingToComment] = useState<string | null>(null);
  const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});

  const userData = useSelector((state: any) => state.userDetails.user || {});
  const userId = userData._id;
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comment/${postId}`);
      const { data } = response;

      if (data.comments) {
        setComments(data.comments);
      } else {
        console.error('No comments found.');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  const handleReplyComment = (commentId: string) => {
    setReplyInput({ [commentId]: '' });
    setReplyingToComment(commentId);
  };

  const handleReplySubmit = async () => {
    if (replyInput[replyingToComment || ''].trim() && replyingToComment) {
      const newReply: Partial<ReplyComment> = {
        userId: userData,
        comment: replyInput[replyingToComment],
        createdAt: new Date(),
      };

      try {
        const response = await axiosInstance.post('/replayComment', {
          newReply,
          commentId: replyingToComment,
        });

        const { data } = response;

        if (data.success) {
          console.log("display to save comment",data.replySaved)
          // const savedReply: ReplyComment = data.replySaved;
          // setComments((prevComments) =>
          //   prevComments.map((comment) =>
          //     comment._id === replyingToComment
          //       ? { ...comment, replyComments: [...comment.replyComments, savedReply] }
          //       : comment
          //   )
          // );

    fetchComments();

          setReplyInput({});
          setReplyingToComment(null);
        } else {
          console.error('Error: Reply was not saved successfully');
        }
      } catch (error) {
        console.error('Error occurred while saving reply:', error);
      }
    }
  };

  const handleCloseReplyPopup = () => {
    setReplyInput({});
    setReplyingToComment(null);
  };

  useEffect(() => {
  

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (commentInput.trim() !== '') {
      const newComment: Partial<Comment> = {
        userId: userData,
        comment: commentInput,
        createdAt: new Date(),
      };

      try {
        const response = await axiosInstance.post('/postComment', {
          newComment,
          postId,
        });

        const { data } = response;

        if (data.success) {
          const savedComment: Comment = data.commentSaved;
          setComments([...comments, savedComment]);
          setCommentInput('');
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
      const response = await axiosInstance.delete(`/deleteComment/${commentId}`);
      const { data } = response;

      if (data.success) {
        const updatedComments = comments.filter((comment) => comment._id !== commentId);
        setComments(updatedComments);
      } else {
        console.error('Error: Comment deletion failed');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const toggleReplies = (commentId: string) => {
    setVisibleReplies((prevVisibleReplies) => ({
      ...prevVisibleReplies,
      [commentId]: !prevVisibleReplies[commentId],
    }));
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-100 rounded-lg min-w-96 max-w-6xl shadow-inner dark:bg-gray-800 sm:p-8">
          <button
            onClick={toggleCommentModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

      
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="w-full px-3 py-2 placeholder-gray-500 bg-gray-100 rounded-lg shadow-inner dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 transition-all duration-200"
        />
        {commentInput && (
          <button
            onClick={handleCommentSubmit}
            type="button"
            className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
            <span className="sr-only">Icon description</span>
          </button>
        )}
      </div>
      <div className="max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="p-2 bg-gray-100 rounded-lg shadow-inner dark:bg-gray-700 mb-2 flex flex-col"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <img
                  src={comment.userId.profileimg}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {comment.userId.username}
                  </span>
                  <span className="ml-1 text-gray-600 dark:text-gray-400 text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  <p className="ml-1 text-gray-800 dark:text-gray-200 mt-1">
                    {comment.comment}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleReplyComment(comment._id)}
                  className="text-gray-500 hover:text-blue-500 focus:outline-none transition-colors duration-200 mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200"
                >
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
            {comment.replyComments.length > 0 && (
              <button
                onClick={() => toggleReplies(comment._id)}
                className="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-200 mt-2"
              >
                {visibleReplies[comment._id] ? 'Hide Replies' : 'View Replies'}
              </button>
            )}
            {visibleReplies[comment._id] && (
              <div className="ml-8 mt-2">
                {comment.replyComments.map((reply) => (
                  <div
                    key={reply._id}
                    className="p-2 bg-gray-100 rounded-lg shadow-inner dark:bg-gray-600 mb-2 flex items-start"
                  >
                    <img
                      src={reply.userId.profileimg}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <div>
                      <span className="font-semibold text-white-800 dark:text-gray-200">
                        {reply.userId.username}
                      </span>
                      <span className="ml-1 text-gray-600 dark:text-gray-400 text-sm">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                      <p className="ml-1 text-gray-800 dark:text-gray-200 mt-1">
                        {reply.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {replyingToComment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Add a reply..."
                value={replyInput[replyingToComment]}
                onChange={(e) => setReplyInput({ [replyingToComment]: e.target.value })}
                className="w-full px-3 py-2 placeholder-gray-500 bg-gray-100 rounded-lg shadow-inner dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 transition-all duration-200"
              />
              <button
                onClick={handleReplySubmit}
                type="button"
                className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
                <span className="sr-only">Icon description</span>
              </button>
            </div>
            <button
              onClick={handleCloseReplyPopup}
              className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
