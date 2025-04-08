'use client';
import { createContext, useState } from 'react';

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [isShow, setIsShow] = useState(false);

  return (
    <ChatContext.Provider value={{ isShow, setIsShow }}>
      {children}
    </ChatContext.Provider>
  );
}