'use client';
import { createContext, useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [isShow, setIsShow] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <ChatContext.Provider value={{ isShow, setIsShow, socket: socketRef.current }}>
      {children}
    </ChatContext.Provider>
  );
}