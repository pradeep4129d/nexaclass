import { useEffect, useState } from 'react'
import './App.css'
import useStore from '../store/store'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Login } from '../components/Login';
import Register from '../components/Register';
import Loading from '../components/Loading';
import DashBoard from '../components/DashBoard';
import Message from '../components/Message';

function App() {
  const {login,isLoading,setLogin,setIsLoading,userData,setUserData,message}=useStore();
  const navigate=useNavigate();
  useEffect(()=>{
    const token=sessionStorage.getItem("token");
    if(token!=null && userData==null){
      setIsLoading(true);
      const fetchdata=async()=>{
      const res= await fetch("http://localhost:3000/student/profile", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
        })
        if(res.ok){
          const responce=await res.json();
          console.log(responce);
          setUserData(responce);
          setLogin(true);
        }else{
          setLogin(false);
        }
        setIsLoading(false);
      navigate("/");
      }
      fetchdata();
    }
  },[])
  return (
    <>
    {isLoading && <Loading/>}
    <Message/>
    <Routes>
      {login?
        <>
        <Route path='/' element={<DashBoard/>}/>
        </>:
        <>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </>
      }
    </Routes>
    </>
  )
}

export default App
