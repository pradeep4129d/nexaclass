import React, { useState } from 'react'
import useStore from '../store/store'
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [loginDetails,setLoginDetails]=useState({email:"",password:""})
  const {setIsLoading,setLogin,setMessage,refresh,setRefresh}=useStore();
  const navigate=useNavigate()
  const handleChange=(e)=>{
    setLoginDetails({...loginDetails,[e.target.name]:e.target.value});
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!loginDetails.email.length>=11 || loginDetails.email.substring(10)!=="@sves.org.in"){
      setMessage({color:"crimson",message:"Enter Valid College Email"})
    }else{
    setIsLoading(true);
    const res= await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email:loginDetails.email,
                password:loginDetails.password
            }),
        })
        if(res.ok){
          const responce=await res.json();
          setMessage({color:"green",message:"login successful"})
          sessionStorage.setItem("token",responce.token)
          setRefresh(refresh?false:true);
          setLogin(true);
        }else{
          setMessage({color:"crimson",message:"invalid Credentials!"})
        }
        setIsLoading(false);
    }
  }
  return (
    <>
    <div className='logincard'>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="email">
          <input type="text" name='email' id='u' placeholder='Email' onChange={handleChange}/>
          <ion-icon name="mail"></ion-icon>
        </div>
        <div className="password">
          <input type="password" name="password" id="p" placeholder='password' onChange={handleChange}/>
          <ion-icon name="key"></ion-icon>
        </div>
        <button type='submit' id='l-sub'>Submit</button>
      </form>
    </div>
    </>
  )
}
