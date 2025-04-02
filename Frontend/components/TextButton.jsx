import React from 'react'

const TextButton = ({
  onClick,
  text="Button"
}= {}) => {
  return (
    <div 
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
      {text}</div>
  )
}

export default TextButton