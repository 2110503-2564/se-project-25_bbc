'use client';
import React, { useContext } from 'react';
import { ChatContext } from '@providers/chatProvider';

const ChatBox = () => {
  const { isShow, setIsShow } = useContext(ChatContext);
  return (
    <div className='hdcard_white'
      style={{
        position:'fixed',
        width: isShow ? `300px` : '20px' ,
        top: isShow ? `20px` : `calc(100% - 60px)`,
        bottom:"60px",
        right: isShow ? "20px" : "20px",
        zIndex:"800",
        overflow:"hidden",
        
        transition:"all 0.6s cubic-bezier(0.34, 1.15, 0.64, 1)"
      }}
    >
      <div 
        className='sub_text2'
        style={{position:"absolute", top:"0", left:"0", right:"0", height: "22px", textAlign:"center", backgroundColor:"white", fontSize:"12px", padding:"5px"}}>
        Customer Support
      </div>
    </div>
  )
}

export default ChatBox