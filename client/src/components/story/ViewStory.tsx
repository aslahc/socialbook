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
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const currentUser = storyData[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];
  
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewers, setViewers] = useState<string[]>([]);

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
    } else {
      handleNextUser();
    }
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
          console.log(response)
          console.log("resspsoende data",response.data)
          console.log("resspsoende data",response.data.success)

        // Check the response status
        if (response.data.success === true) {
           console.log("enter to the delte story succes ")
          dispatch(deleteStory(currentStory.storyImg));
          
          console.log('Story deleted successfully in the resosne');
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
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-75">
      <div className="relative bg-white rounded-3xl shadow-xl">
        <button
          className="absolute top-4 right-4 p-2 rounded-full shadow-md bg-white text-gray-500 hover:bg-gray-100 focus:outline-none"
          onClick={handleCloseStory}
        >
          <X />
        </button>
      
        {currentStory && (
          <>
            <div className="flex items-center py-4 px-6">
              <img
                src={currentUser.userId.profileimg}
                alt="User Avatar"
                className="h-10 w-10 rounded-full mr-2"
              />
              <span className="text-gray-700 font-medium">
                {currentUser.userId.username}
              </span>
            </div>
            <div className="relative p-4">
              <img
                src={currentStory.storyImg}
                alt="Story"
                className="rounded-2xl shadow-lg"
                style={{ width: '400px', height: '550px' }}
              />
              <button
                className="absolute top-2/4 left-4 transform -translate-y-2/4 p-2 rounded-full shadow-md bg-white text-gray-500 hover:bg-gray-100 focus:outline-none"
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
              className="absolute bottom-4 right-16 p-2 rounded-full shadow-md bg-white text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={handleViewers}
            >
              Viewers
            </button>
          )}
          { 

          userId ===currentUser.userId._id &&(

          
             <button
                className="absolute bottom-4 right-4 p-2 rounded-full shadow-md bg-white  text-red-500 hover:bg-gray-100 focus:outline-none"
                onClick={handleDeleteStory}
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
              
                
              
          )

}  


 
              <button
                className="absolute top-2/4 right-4 transform -translate-y-2/4 p-2 rounded-full shadow-md bg-white text-gray-500 hover:bg-gray-100 focus:outline-none"
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
            </div>
          </>
        )}
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
    <div className="bg-white p-8 max-w-md mx-auto rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Story Viewers</h2>
      <ul>
        {viewers && viewers.map((viewer :any, index) => ( 
          <li key={index}>{ viewer.user.username}</li>
        ))}
      </ul>
      <button
        className="mt-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-semibold focus:outline-none"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default ViewStory;