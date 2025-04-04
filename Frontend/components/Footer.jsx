import React from 'react'

const Footer = () => {
  return (
    <div
      className='main_text card_bg1'
      style={{
        height: '250px',
        width: '100vw',
        marginTop: '50px',
        textAlign: 'center',
        paddingTop: '60px',
      }}
    >
      <div 
        className='align_item_center'
        style={{
          width:"100%"
        }}
      >
       <img
          src='/icons/HIDDEN logo blue.svg'
          style={{ height:'13px', width:"100px" }}
          alt="Logo"
        />
      </div>
        <br/>
        <div className='align_item_center'>
        <div style={{textAlign:"center", fontSize:"12px", maxWidth:"500px", marginLeft:"50px", marginRight:"50px"}}>
        Hidden is a secure and user-friendly hotel booking platform offering access to rare and extraordinary stays you won’t find anywhere else. Discover the world through our curated collection of unique hotels.
        </div>
        </div>
    </div>
  )
}

export default Footer