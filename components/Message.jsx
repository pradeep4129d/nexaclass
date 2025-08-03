import React, { useEffect, useState } from 'react'
import useStore from '../store/store'

const Message = () => {
    const {message}=useStore()
    const [transist,setTransist]=useState('')
    useEffect(()=>{
        setTransist('transist');
        setTimeout(() => {
            setTransist('')
        }, 3000);
    },[message])
  return (
    <div className={`message `+transist} style={{background:message.color}}>
        <p>{message.message}</p>
    </div>
  )
}

export default Message