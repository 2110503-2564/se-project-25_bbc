"use client";

import "@styles/global.css";
import Menubar from "@components/Menubar";
import Footer from "@components/Footer";
import ChatButton from "@components/chatSysyem/ChatButton";
import ChatBox from "@components/chatSysyem/ChatBox";
import { ChatProvider } from "@providers/chatProvider";
export default function RootLayout({ children }) {

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
