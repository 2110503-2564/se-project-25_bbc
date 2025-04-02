"use client";

import "@styles/global.css";
import Menubar from "@components/Menubar";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      </head>
      <body>
        <Menubar/>
        {children}
      </body>
    </html>
  );
}
