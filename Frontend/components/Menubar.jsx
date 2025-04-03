import React, { useState, useEffect } from 'react';
import TextButton from './buttons/TextButton';

const Menubar = () => {
  const [atTop, setAtTop] = useState(true);

  //--- scroll style
  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY < 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const overrideStyles = atTop
  ? {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      backdropFilter: 'none',
      boxShadow: 'none'
    }
  : {};
  //---


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
        backgroundColor: atTop ? "rgba(255,255,255, 0)" : "rgba(255,255,255, 0.8)",
        transition: "all 0.5s ease",
        ...overrideStyles
      }}
    >
      {/* Apply invert filter only to children */}
      <div style={{ filter: atTop ? "invert(1)" : "none", transition: "filter 0.5s ease" ,
          position: 'absolute',
          left: '0',
          right: '0',
          top: '0',
          bottom: '0',
      }}>
        <img
          src='/icons/HIDDEN logo.svg'
          className='h-3 mt-4.5 ml-4.5'
          style={{ display: 'inline-block', position: "absolute", left: "4.5px", top: "0px" }}
          alt="Logo"
        />
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
          <TextButton text='Book' linkString='/hotels-page' />
          <TextButton text='My-booking' />
          <TextButton text='Sign-In' linkString='/auth/signin'/>
        </div>
      </div>
    </div>
  );
};

export default Menubar;