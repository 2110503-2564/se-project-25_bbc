import React from 'react'
import SigninBox from '@components/SigninBox'

const page = () => {
  return (
    <div style={{width:"100vw", height:"100vh", position:"absolute", top:"0", overflow:"hidden"}} className='main_bg'>
      <img src='/images/HIDDEN WINGS.svg' style={{height:"300px", position:"absolute", right:"-200px", bottom:"-100px", rotate:"90deg" }}/>
      <img src='/images/HIDDEN WINGS.svg' style={{height:"300px", position:"absolute", left:"-200px", top:"-100px", rotate:"270deg" }}/>
      <div style={{backgroundColor:'white', height:"100%", width:"300px", left:"calc(50% - 150px)", position:"absolute"}}>
      <SigninBox/>
      </div>
      
    </div>
  )
}

export default page