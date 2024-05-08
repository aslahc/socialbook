import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';

const VideoCall: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { roomId,  } = useParams(); // Use useParams without specifying a custom type
  const userData = useSelector((state: any) => state.userDetails.user||'');
  const userId = userData._id;
    

  
  useEffect(() => {
    if (!roomId || !userId) {
      // Handle missing parameters
      console.error('roomId or userId is missing');
      return;
    }

    const appId = 1454805893;
    const serverSecret = '46c0df3fd265047fad4e49b366fbf0ae';
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      userId,
      'aslah'
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
  }, [roomId, userId]);

  return <div ref={elementRef}></div>;
};

export default VideoCall;