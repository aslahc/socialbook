import React from 'react'
import { useDispatch,useSelector} from 'react-redux';
import { RootState } from '../../utils/store/store'
import { User } from '../../types/types';
interface ChatListProps {
  onUserSelect: (user: User) => void; // Callback function for user selection
}
function ChatList({ onUserSelect }: ChatListProps) {
  const userData = useSelector((state: any) => state.userDetails.user || '');
  const userId = userData._id // logged user id 


//other users id 
const usersData = useSelector((state: RootState) => state.users.users);
const users = usersData.filter((user)=> user._id !== userId)

  return (
    <div>

      {users.map((user)=>

      
    <div
    onClick={() => onUserSelect(user)} 
    className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
      <div className="w-1/4">
            <img
              src={user.profileimg || 'https://via.placeholder.com/150'}
              className="object-cover h-12 w-12 rounded-full shadow-lg"
              alt=""
            />
          </div>
      <div className="w-full">
        <div className="text-lg font-semibold">{user.username}</div>
        {/* <span className="text-gray-500">Pick me at 9:00 Am</span> */}
      </div>
    </div>
    )

  }
  </div>

  )
}

export default ChatList