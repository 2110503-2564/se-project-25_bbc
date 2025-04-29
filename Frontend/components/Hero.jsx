"use client";

import React, { useState, useEffect } from "react";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div
      className="main_bg align_item_center"
      style={{
        width: "100%",
        paddingLeft: "20px",
        paddingRight: "20px",
        minHeight:"900px",
        height: isMobile ? "105vh" : "100vh",
        zIndex: "-300",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/images/Hero img.svg"
        style={{
          width: isMobile ? "100%" : "50%",
          display: "block",
          marginLeft: isMobile ? 0 : "5%",
        }}
      />
      <div
        style={{
          color: "white",
          fontSize: "50px",
          fontWeight: "600",
          width: isMobile ? "100%" : "50vw",
          height: "auto",
          marginTop: isMobile ? "20px" : 0,
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: isMobile ? "center" : "left",
            fontSize: isMobile ? "60px" : "90px",
          }}
        >
          Find The
          <img src="/images/HIDDEN HERO.svg" style={{ height: "100px", marginBottom:"-10px", width: isMobile ? "100%": "", marginLeft: isMobile ? "20px" : "" }} /> 
          Gems
        </div>
      </div>
    </div>
  );
};

export default Hero;
