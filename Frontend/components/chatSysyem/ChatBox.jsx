"use client";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext } from '@providers/chatProvider';
import io, { Socket } from 'socket.io-client';

const ChatBox = () => {
  const { isShow, setIsShow } = useContext(ChatContext);
  const socketRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasJoinedChat, setHasJoinedChat] = useState(false);

  const [account_id, setAccountId] = useState('');
  const [hotel_id, setHotelId] = useState('');
  const [role , setRole] = useState('');
  const textareaRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const login = JSON.parse(localStorage.getItem("res_login"));
    setAccountId(login?.account?.id);
    setRole(login?.account?.role);
    setHotelId(login?.account?.hotel_id);
  }, []);

  useEffect(() => {

    if(!account_id && !hotel_id) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);  

    socketRef.current.emit('search_chat', ({account_id , hotel_id}));

    socketRef.current.on('my_chat', (chats) => setChats(chats));

    socketRef.current.on('message_history', ({ messageHistory }) => {
      setMessages(messageHistory);
      setHasJoinedChat(true); // Set flag
    })

    socketRef.current.on('receive_message', (incomingMessage) => 
      setMessages((prevMessages) => [...prevMessages, incomingMessage])
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [account_id]);

  // Handle room selection
  const handleRoomSelection = (chatRoom) => {
    setChat(chatRoom);
    socketRef.current.emit('join_chat', { chat_id : chatRoom._id });
  };

  // Handle message sending
  const handleSendMessage = () => {

      const newMessage = {
        from: account_id,
        text: message,
        chat_id: chat._id
      };

      socketRef.current.emit('send_message', newMessage);
      setMessage(''); 
      if (textareaRef.current) {
        textareaRef.current.value = '';
        textareaRef.current.style.height = 'auto';
      }
  };

  // Handle auto sroll
  useEffect(() => {
    if (!hasJoinedChat) return;
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [hasJoinedChat]);

  // Handle input area
  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'; // Set to scrollHeight
    }
  };
  

  if(!chats) return <div>Loading</div>

  return (
    <div
      className='hdcard_white border border-gray-300'
      style={{
        borderRadius: '30px',
        position: 'fixed',
        width: '300px',
        top: '60px',
        bottom: '60px',
        right: '20px',
        zIndex: '800',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.34, 1.15, 0.64, 1)',
        pointerEvents: isShow ? "all" : "none",
        scale: isShow ? 1 : 0.1,
        transformOrigin: "bottom right",
        opacity: isShow ? 1: 0
      }}
    >
      <div
        className='sub_text2'
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '30px',
          textAlign: 'center',
          backgroundColor: 'white',
          fontSize: '12px',
          padding: '4px',
        }}
      >
        Customer Support
      </div>

      {/* Show room selection if no room is selected */}
      {!chat ? (
        <div style={{ marginTop: '20px', padding: '10px', height: 'calc(100% - 50px)', overflowY: 'auto' }}>
          <h3>Select a Chat Room</h3>
          <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
            {chats?.map((room) => (
              <li
                key={room._id}
                onClick={() => handleRoomSelection(room)}
                style={{
                  cursor: 'pointer',
                  margin: '10px 0',
                  padding: '8px',
                  background: '#f0f0f0',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={room.hotel_image_url}
                  alt={room.hotel_name}
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    marginRight: '10px',
                    borderRadius: '5px',
                  }}
                />
                <span style={{ fontSize: '14px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {room.hotel_id.name} - Chat Room
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Show chat once a room is selected
        <div style={{ top: '20px', padding: '10px', position:"absolute", bottom:"0", left:"0", right:"0" }}>
          <div id="chatBox" 
          className='hide_scrollbar'
          ref={chatBoxRef}
          style={{ position:"absolute", top:"0", bottom:"80px", paddingBottom:"50px", left:"5px", right:"5px", overflowY: 'scroll' }}>
            {/* Display messages as chat bubbles */}
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: msg.from === account_id ? 'row-reverse' : 'row',
                  marginBottom: '10px',
                  padding: '5px',
                  position: 'relative',
                  minHeight: '40px'
                }}
              >
                <div
                  className={`${msg.from === account_id ? "main_bg" : "card_bg2"}`}
                  style={{
                    color: msg.from === account_id ? 'white' : 'black',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div 
            className='card_bg2'
          
          style={{ position: 'absolute', bottom: '10px', left:"10px", right:"10px", borderRadius:"20px", boxSizing:"border-box", padding:"5px"  }}>
              <textarea
              ref={textareaRef}
              rows="1"
              value={message}
              onChange={handleChangeMessage}
              placeholder="Type a message"
              style={{
                width: 'calc(100% - 10px)',
                padding: '8px',
                marginBottom: '40px',
                borderRadius: '10px',
                marginTop:"5px",
                border: 'none',
                marginLeft: '5px',
                marginRight: '5px',
                overflow: 'hidden',
                resize: 'none', // Prevent manual resize
                fontSize: '14px',
              }}
            />
            <button
              onClick={handleSendMessage}
              className='main_bg align_item_center'
              style={{
                width: '35px',
                height: '35px',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                right:'10px',
                bottom:'10px',
                position:'absolute'
              }}
            >
             <img src='/icons/send.svg' style={{width:"18px", marginRight:"2px", marginTop:"2.5px"}}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
