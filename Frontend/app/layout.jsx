"use client";

import "@styles/global.css";
import Menubar from "@components/Menubar";
import Footer from "@components/Footer";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      </head>
      <body>
        <Menubar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
