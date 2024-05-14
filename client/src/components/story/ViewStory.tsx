import React, { useState ,useEffect} from 'react';
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../axios/axios'
import { deleteStory } from '../../utils/reducers/StoryData';
import { isConstructorDeclaration } from 'typescript';
interface Istory {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileimg: string;
  };
  stories: {
    storyImg: string;
    views: string[];
    createOn: string;
    expireOn: string;
    _id: string;
  }[];
}

interface ViewStoryProps {
  setShowStory: (value: React.SetStateAction<boolean>) => void;
  storyData: Istory[];
}

function ViewStory({ setShowStory, storyData }: ViewStoryProps) {

  console.log(storyData,"qwe")
  const [storyTime, setStoryTime] = useState(10); 
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (storyTime === 0) {
        // Move to the next story when the timer reaches zero
        handleNextStory();
      } else {
        setStoryTime(storyTime - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [storyTime]);



  const currentUser = storyData[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];
  
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewers, setViewers] = useState<string[]>([]);
  const [deleteModal, setdeleteModal] =  useState<boolean>(false)

  const watchStory = async (storyImg:string, userId:string) => {
    try {
      const response = await axiosInstance.post('/watchStory', { storyImg, userId });
      console.log('Story view updated:', response.data);

      // Handle UI update or any necessary actions after updating the story view
    } catch (error) {
      console.error('Error watching story:', error);
      // Handle error scenarios
    }
  };

  // Trigger watchStory when this component mounts
  useEffect(() => {
    if (userId && currentStory?.storyImg) {
      
      watchStory(currentStory.storyImg, userId);
    }
  }, [currentStory, userId]);




  const toogleDelete = () =>{

    setdeleteModal(!deleteModal)
  }

   
  const handleNextUser = () => {
    if (currentUserIndex < storyData.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    }
  };

  const handlePrevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(currentUser?.stories.length - 1 || 0);
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < currentUser?.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      resetTimer();

    } else {
   handleCloseStory()

      handleNextUser();
    }
  };
  const resetTimer = () => {
    setStoryTime(10); // Reset timer to initial time
  };
  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      handlePrevUser();
    }
  };

  const handleCloseStory = () => {
    setShowStory(false);
  };

    const handleDeleteStory = async () => {
      try {
    setdeleteModal(!deleteModal)

        // Get the story ID to be deleted
        const storyIdToDelete = currentStory._id;
    
        // Send a DELETE request to your backend endpoint
        const response = await axiosInstance.delete(`/deleteStory/${storyIdToDelete}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            userId: userId,
            currentStory:currentStory.storyImg,

          }
        });
        console.log(123)
          console.log(response)
          console.log("resspsoende data",response.data)
          console.log("resspsoende data",response.data.success)

        // Check the response status
        if (response.data.success === true) {
           console.log("enter to the delte story succes ")
           console.log(currentStory.storyImg)
          dispatch(deleteStory(currentStory.storyImg));
          
          // If the story is deleted successfully, you can update your UI or perform any necessary actions
          // For example, you might want to remove the story from the local state or trigger a reload of data
        } else {
          console.log('Failed to delete storysssss');
          // Handle any error scenarios here
        }
      } catch (error) {
        console.error('Error deleting story:', error);
        // Handle errors such as network issues or server errors
      }
    };
   
    const handleViewers = async () => {
      try {
          const storyImg = currentStory.storyImg; // Assuming currentStory is defined elsewhere
    console.log(storyImg,"this is iam passint ")
          const response = await axiosInstance.get('/stories/viewers', {
            params: {
              storyImg: storyImg
          }
          });
           console.log("this is the respone  of story viewas ",response)
           const viewersData = response.data.views;

           // Extract usernames from viewersData
       
           setViewers(viewersData);
           setIsModalOpen(true); // Open the modal to display viewers
      } catch (error) {
          console.error('Error fetching viewers:', error);
          // Handle error fetching viewers
      }
    }
 console.log(viewers,"views set")
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-gray-900 bg-opacity-75">
    <div className="relative bg-white rounded-xl shadow-2xl  max-w-md  max-h-auto mx-auto">
      <button
        className="absolute top-4 right-4 p-2 rounded-full shadow-lg bg-white text-gray-500 hover:bg-gray-100 focus:outline-none"
        onClick={handleCloseStory}
      >
        <X />
      </button>
  
      {currentStory && (
        <>
          <div className="flex items-center mb-2">
            
            <img
              src={currentUser.userId.profileimg ||  "/download.jpeg"}
              alt="User Avatar"
              className="h-10 w-10 rounded-full mr-2"
            />
            <span className="text-gray-700 font-medium">
              {currentUser.userId.username}
            </span>
          </div>
          <div className="relative">
            <img
              src={currentStory.storyImg}
              alt="Story"
              className="rounded-2xl shadow-lg"
              style={{ width: '400px', height: '550px' }}
            />
            <button
              className="absolute top-2/4 left-4 transform -translate-y-2/4 p-2 rounded-full shadow-lg bg-white text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={handlePrevStory}
              disabled={currentStoryIndex === 0 && currentUserIndex === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            {userId === currentUser.userId._id && (
        <button
        className="flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 focus:outline-none mr-3"
        onClick={handleViewers}
      >
        <svg
          className="w-4 h-4 mr-1.5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="text-gray-600 text-sm font-medium">Views</span>
      </button>
            )}
            {userId === currentUser.userId._id && (
              <button
                className="absolute bottom-4 right-4 p-2 rounded-full shadow-lg bg-white text-red-500 hover:bg-gray-100 focus:outline-none"
                onClick={toogleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
  
            <button
              className="absolute top-2/4 right-4 transform -translate-y-2/4 p-2 rounded-full shadow-lg bg-white text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={handleNextStory}
              disabled={
                currentStoryIndex === currentUser?.stories.length - 1 &&
                currentUserIndex === storyData.length - 1
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-2 left-0 w-full">
            <div className="bg-black bg-opacity-50 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000 ease-linear"
                style={{ width: `${(storyTime / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          </div>
          
        </>
            

      )}
    </div>
    {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="relative p-4 w-full max-w-md">
      <div className="p-4 text-center bg-white rounded-lg shadow sm:p-5">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-black-900 hover:text-gray-900 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Story Viewers</h2>
        <div className="overflow-y-auto max-h-60">
          <ul className="divide-y divide-gray-300">
            {viewers.map((viewer: any, index: number) => (
              <li key={index} className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={viewer.user.profileimg || "/default-profile.jpg"}
                      alt={`${viewer.user.username}'s avatar`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {viewer.user.username}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
)}

{deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={()=>            setdeleteModal(!deleteModal)}

              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <svg className="text-gray-400 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="mb-4 text-gray-500">Are you sure you want to report this post?</p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  type="button"
                 
                    onClick={()=>            setdeleteModal(!deleteModal)
}


                  className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300"
                >
                  No, cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStory}

     
                  className="py-2 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                >
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        
    </div>
  );
}

export default ViewStory;