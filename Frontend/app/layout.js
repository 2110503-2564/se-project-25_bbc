"use client";

import "@styles/global.css";

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <link rel = "manifest" href="/manifest.json"/>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}