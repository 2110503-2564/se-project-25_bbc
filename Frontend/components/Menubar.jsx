"use client";
import React, { useState, useEffect } from 'react';
import TextButton from './buttons/TextButton';
import Link from 'next/link';
import Image from 'next/image';

const Menubar = () => {
  const [atTop, setAtTop] = useState(true);
  const [mounted, setMounted] = useState(false); 
  const [token, setToken] = useState(null);
  const [user,setUser] = useState(null);

  // for resposive design
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  // for scroll
  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);

    // ✅ This runs only on client
    const storedToken = localStorage.getItem("token");
    const storedLogin = localStorage.getItem("res_login");
    const parsedLogin = JSON.parse(storedLogin); // json contain data when login
    // console.log(parsedLogin);
    setUser(parsedLogin);
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
        left:"5px",
        right:"5px",
        top:"5px"
      }
    : {};

  return (
    <div
      className="hdcard_white align_item_center backdrop-blur"
      style={{
        position: 'fixed',
        left: '100px',
        right: '100px',
        top: '5px',
        height: '48px',
        zIndex: '300',
        borderRadius: '30px',
        backgroundColor: atTop ? "rgba(255,255,255, 0)" : "rgba(255,255,255, 0.8)",
        transition: 'all 0.6s cubic-bezier(0.34, 1.35, 0.64, 1)',
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
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: '0px', // optional padding
          }}
        >
          {!isMobile && (
          <>
          <TextButton text='Hotels' linkString='/hotels-page' />
          <TextButton text='My-booking' linkString='/my-booking-page' />
          </>
          )}
          {isMobile && (
            <>
            <div onClick={handleMenuToggle} style={{ height: "100%", width: "55px", display:"inline-block", position:"relative" }}>
            <img
              src='/icons/menu-2.svg'
              style={{
                height: '25px',
                marginLeft: "14px",
                marginTop: "11px",
                display: 'inline-block',
                position: "absolute",
                left: "4.5px",
                top: "0px"
              }}
              alt="Logo"
            />
            {menuOpen && (
              <div className='border border-gray-300' style={{backgroundColor:"white", position:"absolute", top:"50px", right:"0px", width:"140px", borderRadius:"10px", paddingBottom:"5px", boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.132)"}}>
                <TextButton text='Hotels' linkString='/hotels-page' />
                <div style={{width:"100%", height:"1px", backgroundColor:"rgba(0,0,0,0.1)", position:"absolute", left:"0", right:"0", top:"42px"}}></div>
                <TextButton text='My-booking' linkString='/my-booking-page' />
              </div>
            )}
          </div></>
          )}
          {mounted && token ? (
            <TextButton text='Sign-out' linkString='/' onClick={handleSignOut} showBox={true} />
          ) : mounted ? (
            <TextButton text='Sign-In' linkString='/auth/signin' showBox={true} />
          ) : null}

          {mounted && user && (
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src="/icons/profile-user-black.png"
                  alt="profile-icon"
                  width={30}
                  height={30}
                  style={{ marginRight: '10px' }}
                />
              </div>
            </div>
          )}
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
