  import React ,{useState} from 'react';
  import Conversation from '../../components/chat/Conversation';
  import ChatList from '../../components/chat/ChatList';
  import { useDispatch,useSelector} from 'react-redux';
  import { RootState } from '../../utils/store/store'
import { User } from '../../types/types';



  function Chat() {
    
    // logined user 
    const userData = useSelector((state: any) => state.userDetails.user || '');
    const userId = userData._id // logged user id 
    const [selectedUser, setSelectedUser] = useState<User | null>(null); 

  //other users id 
  const usersData = useSelector((state: RootState) => state.users.users);
  const users = usersData.filter((user)=> user._id !== userId)
  console.log(users)
  const handleUserSelect = (user: User) => {
    setSelectedUser(user); // Update selectedUser state when a user is clicked
  };

    return (
      <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="container mx-auto shadow-lg rounded-lg bg-white p-6 sm:p-2">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex flex-col w-full sm:w-2/5 border-r-2 sm:border-r-2 overflow-y-auto">
            {/* <!-- search component --> */}
            <div className="mb-4 px-2">
              <input
                type="text"
                placeholder="Search chatting"
                className="py-2 px-2 rounded-full w-full shadow-inner"
              />
            </div>
            {/* <!-- end search component -->
            <!-- user list --> */}
            <ChatList onUserSelect={handleUserSelect}  />
            {/* <!-- end user list --> */}
          </div>
          {/* <!-- end chat list -->
          <!-- message --> */}
          {selectedUser && <Conversation user={selectedUser} />}
        </div>
      </div>
    </div>
    );
  }

  export default Chat;