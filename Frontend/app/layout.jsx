"use client";

import "@styles/global.css";
import Menubar from "@components/Menubar";
import Footer from "@components/Footer";
import ChatButton from "@components/chatSysyem/ChatButton";
import ChatBox from "@components/chatSysyem/ChatBox";
import { ChatProvider } from "@providers/chatProvider";
import { use } from "@node_modules/@types/react";
export default function RootLayout({ children }) {

  useEffect(() => {
     // Set up periodic check every 20 seconds
     const interval = setInterval(checkTokenValidity, 20000);
     return () => clearInterval(interval);
  }, [])

  return (
    <html lang="en">
      <head>

      </head>
      <body>
        <ChatProvider>
          <Menubar/>
          {children}
          <Footer/>
          <ChatButton/>
          <ChatBox/>
        </ChatProvider>
      </body>
    </html>
  );
}
