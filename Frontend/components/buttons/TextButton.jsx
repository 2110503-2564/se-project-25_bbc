import Link from '@node_modules/next/link'
import React from 'react'

const TextButton = ({
  onClick,
  text="Button",
  linkString=""
}= {}) => {
  return (
    <Link href={linkString}>
    <div 
      onClick={onClick}
      style={{
        display:"inline-block",
        height:'48px',
        alignItems:"center",
        boxSizing:"border-box",
        padding:"6px",
        paddingTop:"11px",
        marginRight:"10px",
        fontSize:"18px",
        fontWeight:"400"
      }}
    >
      {text}
    </div>
    </Link>
  )
}

export default TextButton