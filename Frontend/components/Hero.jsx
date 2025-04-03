import React from 'react'

const Hero = () => {
  return (
    <div 
      className='main_bg align_item_center'
      style={{
        width:"100%",
        paddingLeft:"20px",
        paddingRight:"20px",
        height:"100vh",
        zIndex:"-300",
        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
      }}
    >
      <img src="/images/HIDDEN HERO.svg" style={{width:"50%", marginLeft:"5%"}}/>
      <div style={{color:"white", fontSize:"50px", fontWeight:"600", width:"100%",position:"absolute", height:"400px"}}>
        <div style={{position:"absolute", bottom:"30px", width:"100%", textAlign:'center', fontSize:"30%"}}>
        Find The Hidden Gems
        </div>
        </div>
    </div>

  )
}

export default Hero