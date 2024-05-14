import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { RootState } from '../../utils/store/store'

const VideoCall: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { roomId, userId } = useParams(); // Use useParams without specifying a custom type
  const userData = useSelector((state: any) => state.userDetails.user||'');
  const user = userData._id;
  // const usersData = useSelector((state: RootState) => state.users.users);
  const users = useSelector((state: RootState) => state.users.users);

  // Find the user with the matching ID
  const userDetails = users.find((user) => user._id === userId);



  useEffect(() => {
    if (!roomId || !user) {
      // Handle missing parameters
      console.error('roomId or user is missing');
      return;
    }

    const appId = 1454805893;
    const serverSecret = '46c0df3fd265047fad4e49b366fbf0ae';
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      user,
      userDetails?.username
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: elementRef.current!,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      sharedLinks: [
        {
          name: 'Copy Link',
          url: `http://localhost:3000/room/${roomId}`,
        },
      ],
    });

    return () => {
      zc.destroy();
    };
  }, [roomId, user]);

  return <div ref={elementRef}></div>;
};

export default VideoCall;