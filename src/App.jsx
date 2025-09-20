import { useEffect, useState } from 'react'
import './App.css'
import useStore from '../store/store'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Login } from '../components/Login';
import Register from '../components/Register';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { Tasks } from '../components/Tasks';
import { Quiz } from '../components/Quiz';
import { Tests } from '../components/Tests';
import { ClassRoom } from '../components/ClassRoom';
import { ShowCR } from '../components/ShowCR';
import { ShowQuiz } from '../components/ShowQuiz';
import { ShowTask } from '../components/ShowTask';

function App() {
  const {login,isLoading,setLogin,setIsLoading,userData,setUserData,message,refresh}=useStore();
  const navigate=useNavigate();
  useEffect(()=>{
    const token=sessionStorage.getItem("token");
    if(token!=null && userData==null){
      setIsLoading(true);
      const fetchdata=async()=>{
      const res= await fetch("http://localhost:3000/auth/profile", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body:JSON.stringify({token:token})
        })
        if(res.ok){
          const responce=await res.json();
          console.log(responce);
          setUserData(responce);
          setLogin(true);
        }else{
          setLogin(false);
          sessionStorage.removeItem("token");
        }
        setIsLoading(false);
      navigate("/");
      }
      fetchdata();
    }else 
      setLogin(false)
  },[refresh])
  return (
    <>
    {isLoading && <Loading/>}
    <Message/>
    <Routes>
      {login?
        <>
        {userData!==null && userData.role==="FACULTY" &&
        <><Route path='/' element={<ClassRoom/>}/>
        <Route path='/classroom' element={<ShowCR/>}/>
        <Route path='/tasks' element={<Tasks/>}/>
        <Route path='/quizes' element={<Quiz/>}/>
        <Route path='/tests' element={<Tests/>}/>
        <Route path='/quiz' element={<ShowQuiz/>}/>
        <Route path='/task' element={<ShowTask/>} />
        </>}
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
