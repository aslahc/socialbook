  import { useEffect } from 'react';
  import axiosInstance from '../../axios/axios';
  import { useDispatch } from 'react-redux';
  import { followUser, unfollowUser } from '../../utils/reducers/userData';
  import { followingUser, unfollowingUser } from '../../utils/reducers/userDetails';
  import useSocketIO from '../Notification/Notification'


  const useFollowUser = () => {
    const dispatch = useDispatch();
    const baseURL = axiosInstance.defaults.baseURL;
    const { sendNotification } = useSocketIO();
    const followUserAction = async (userId :string, followerId:string) => {
      try {
        const response = await axiosInstance.post(`${baseURL}/users/follow/${userId}`, { followerId });
        if (response.data.success === true) {
          dispatch(followUser({ userId, followerId }));
          dispatch(followingUser({ userId, followerId }));
          const senderName = 'John Doe'; // Replace with actual sender's name
          const message = 'started following you';
          sendNotification({ receiverId: userId, senderName, message, user: followerId });
        }
      } catch (error) {
        console.log('Failed to follow the user:', error);
      }
    };

    const unfollowUserAction = async (userId :string, followerId:string) => {
      try {
        await axiosInstance.post(`${baseURL}/users/unfollow/${userId}`, { followerId });
        dispatch(unfollowingUser({ userId, followerId }));
        dispatch(unfollowUser({ userId, followerId }));
      } catch (error) {
        console.log('Failed to unfollow the user:', error);
      }
    };

    return { followUserAction, unfollowUserAction };
  };

  export default useFollowUser;
