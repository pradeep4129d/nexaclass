import { useState } from 'react'
import './App.css'
import useStore from '../store/store'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from '../components/Login';
import Register from '../components/Register';

function App() {
  const {login}=useStore();
  return (
    <>
    <Routes>
      {login?
        <>

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
