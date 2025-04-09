import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChatContext } from '@providers/chatProvider';
import io from 'socket.io-client';

const ChatBox = () => {
  const { isShow, setIsShow } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [role, setRole] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null); // Add a ref for the message container
  
  useEffect(() => {

    const login = JSON.parse(localStorage.getItem(res_login)); 
    const account_id = login?.account?.id;
    const hotel_id = login?.account?.hotel_id;
    const role = login?.account?.role;
    setRole(role)

    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    socketRef.current = socket;

    socket.emit('join_room', { account_id , hotel_id });

    socket.on('message_history', (history) => {
      setMessages(history);
    });

    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });

    return () => {
      socket.off('new_message');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const message = {
      from: userId,
      to: adminId,
      text,
    };

    socketRef.current.emit('send_message', message);
    setText('');
  };

  return (
    <div className='hdcard_white'
      style={{
        position: 'fixed',
        width: isShow ? `300px` : '20px',
        top: isShow ? `20px` : `calc(100% - 60px)`,
        bottom: '60px',
        right: '20px',
        zIndex: '800',
        overflow: 'hidden',
        transition: 'all 0.6s cubic-bezier(0.34, 1.15, 0.64, 1)',
      }}
    >
      <div 
        className='sub_text2'
        style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '22px', textAlign: 'center', backgroundColor: 'white', fontSize: '12px', padding: '5px' }}
      >
        Customer Support
      </div>
      <div
        style={{
          position: 'absolute',
          top: '30px',
          bottom: '60px',
          left: '0',
          right: '0',
          padding: '10px',
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, idx) => {
          const isUser = msg.from === userId;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  backgroundColor: isUser ? 'var(--main-color)' : '#f0f0f0',
                  color: isUser ? 'white' : 'black',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  maxWidth: '75%',
                  fontSize: '15px',
                  lineHeight: '1.4',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} /> {/* This div is used to scroll to the bottom */}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '5px',
          display: 'flex',
          padding: '8px',
          background: 'white',
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--sub-color2)',
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          className="clickButton"
          style={{
            marginLeft: '6px',
            padding: '8px 14px',
            backgroundColor: 'var(--main-color)',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
