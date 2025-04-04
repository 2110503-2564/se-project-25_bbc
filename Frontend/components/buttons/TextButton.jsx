import Link from '@node_modules/next/link'
import React from 'react'

const TextButton = ({
  onClick,
  text="Button",
  linkString="",
  showBox=false
}= {}) => {
  return (
    <Link href={linkString}>
    <div 
      className={`${showBox ? "cutout-text" : ""}`}
      onClick={onClick}
      style={{
        display:"inline-block",
        height:'32px',
        alignItems:"center",
        boxSizing:"border-box",
        padding:"6px",
        paddingLeft:"20px",
        paddingRight:"20px",
        paddingTop:"5px",
        marginTop:"8px",
        marginRight:"8px",
        fontSize:"15px",
        fontWeight:"400",
        borderRadius:"20px",
        backgroundColor:`${showBox ? "black" : "transparent"}`,
        color:`${showBox ? "white" : "black"}`,
      }}
    >
      {text}
    </div>
    </Link>
  )
}

export default TextButton