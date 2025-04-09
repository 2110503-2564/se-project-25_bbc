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

  const [account_id, setAccountId] = useState('');
  const [hotel_id, setHotelId] = useState('');
  const [role , setRole] = useState('');

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

    socketRef.current.on('message_history', ({ messageHistory }) => setMessages(messageHistory));

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
  };

  if(!chats) return <div>Loading</div>

  return (
    <div
      className='hdcard_white'
      style={{
        position: 'fixed',
        width: isShow ? '300px' : '20px',
        top: isShow ? '20px' : 'calc(100% - 60px)',
        bottom: '60px',
        right: '20px',
        zIndex: '800',
        overflow: 'hidden',
        transition: 'all 0.6s cubic-bezier(0.34, 1.15, 0.64, 1)',
      }}
    >
      <div
        className='sub_text2'
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '22px',
          textAlign: 'center',
          backgroundColor: 'white',
          fontSize: '12px',
          padding: '5px',
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
        <div style={{ marginTop: '20px', padding: '10px' }}>
          <h3>Chat with {chat.hotel_name}</h3>
          <div id="chatBox" style={{ height: 'calc(100% - 80px)', overflowY: 'auto' }}>
            {/* Display messages as chat bubbles */}
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: msg.from === account_id ? 'row-reverse' : 'row',
                  marginBottom: '10px',
                  padding: '5px',
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.from === account_id ? '#4CAF50' : '#f0f0f0',
                    color: msg.from === account_id ? 'white' : 'black',
                    borderRadius: '20px',
                    padding: '10px 15px',
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: '10px' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
