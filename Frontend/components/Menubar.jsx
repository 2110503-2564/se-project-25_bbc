"use client";
import React, { useState, useEffect } from 'react';
import TextButton from './buttons/TextButton';
import Link from 'next/link';

const Menubar = () => {
  const [atTop, setAtTop] = useState(true);
  const [mounted, setMounted] = useState(false); 
  const [token, setToken] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);

    // ✅ This runs only on client
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setMounted(true); // ✅ Set mounted true after client-side run

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    document.cookie = "token=; path=/; max-age=0";
  };

  const overrideStyles = atTop
    ? {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        backdropFilter: 'none',
        boxShadow: 'none',
      }
    : {};

  return (
    <div
      className="hdcard_white align_item_center backdrop-blur"
      style={{
        position: 'fixed',
        left: '5px',
        right: '5px',
        top: '5px',
        height: '48px',
        zIndex: '300',
        borderRadius: '30px',
        backgroundColor: atTop ? "rgba(255,255,255, 0)" : "rgba(255,255,255, 0.8)",
        transition: "all 0.5s ease",
        ...overrideStyles
      }}
    >
      <div style={{
        filter: atTop ? "invert(1)" : "none",
        transition: "filter 0.5s ease",
        position: 'absolute',
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
      }}>
        <div
          style={{
            position: 'absolute',
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            textAlign: 'right',
          }}
        >
          <TextButton text='Hotels' linkString='/hotels-page' />
          <TextButton text='My-booking' />
          
          {mounted && token ? (
            <TextButton text='Sign-out' linkString='/' onClick={handleSignOut} showBox={true} />
          ) : mounted ? (
            <TextButton text='Sign-In' linkString='/auth/signin' showBox={true} />
          ) : null}
        </div>

        <Link href='/' style={{zIndex: "300"}}>
          <div style={{ height: "100%", width: "110px" }}>
            <img
              src='/icons/HIDDEN logo.svg'
              style={{
                height: '13px',
                marginLeft: "14px",
                marginTop: "17.5px",
                display: 'inline-block',
                position: "absolute",
                left: "4.5px",
                top: "0px"
              }}
              alt="Logo"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Menubar;
