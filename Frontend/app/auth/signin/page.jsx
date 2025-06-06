import React from 'react'
import SigninBox from '@components/SigninBox'
import Link from '@node_modules/next/link'

const page = () => {
  return (
    <div style={{width:"100vw", height:"100vh", position:"absolute", top:"0", overflow:"hidden"}} className='main_bg'>
      <img src='/images/HIDDEN WINGS.svg' style={{height:"300px", position:"absolute", right:"-200px", bottom:"-100px", rotate:"90deg" }}/>
      <img src='/images/HIDDEN WINGS.svg' style={{height:"300px", position:"absolute", left:"-200px", top:"-100px", rotate:"270deg" }}/>
      <div 
      className='align_item_center'
      style={{backgroundColor:'white', height:"100%", width:"300px", left:"calc(50% - 150px)", position:"absolute"}}>
      <div style={{marginBottom:"120px", width:"100%"}}>
      <div 
          className='home_text'
          style={{width:"100%", textAlign:"center", fontSize:"20px", fontWeight:"600"}}>
          Welcome Back!
        </div>
        <SigninBox/>
        <div 
          className='home_text'
          style={{width:"100%", textAlign:"center"}}>
          Not have an account yet?
        </div>
        <Link href={"/auth/reg"} style={{textDecoration:"none"}}>
        <div 
          className='main_text'
          style={{width:"100%", textAlign:"center"}}
        >
          Register
        </div>
        </Link>
      </div>
      </div>
      
    </div>
  )
}

export default page