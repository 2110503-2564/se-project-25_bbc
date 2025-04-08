'use client';
import React, { useContext } from 'react';
import { ChatContext } from '@providers/chatProvider';

const ChatBox = () => {
  const { isShow, setIsShow } = useContext(ChatContext);
  return (
    <div className='hdcard_white'
      style={{
        position:'fixed',
        width: isShow ? `500px` : `0px`,
        top:'20px',
        bottom:"20px",
        right:"20px",
        zIndex:"800",
        overflow:"hidden"
      }}
    >chatBox</div>
  )
}

export default ChatBox