import React, { useEffect, useState } from 'react'
import AnimatedList from './AnimatedList';

export const Home = () => {
  const [classRooms,setClassRooms]=useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const [searchItems,setSearchItems]=useState([]);
  useEffect(()=>{
    const token=sessionStorage.getItem("token");
    if(token==null){
      return;
    }
    const fetchData=async()=>{
      const res=await fetch("http://localhost:3000/student/classrooms",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data=await res.json();
      console.log(data);
      setClassRooms(data);
    }
    fetchData();
  },[])
  const handleSearch=(e)=>{
    setSearchTerm(e.target.value);
    const filteredItems=classRooms.filter((cr)=>
      cr.name.toLowerCase().includes(e.target.value.toLowerCase()) || cr.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchItems(filteredItems);
  }
  return (
    <div className='tab-con'>
      <div className="s-con">
        <div></div>
        <ion-icon name="search-outline"></ion-icon>
        <input type="text" className='search' placeholder='Search class room...' value={searchTerm} onChange={handleSearch} /> 
      </div>
      {
        classRooms.length===0?
        <div className="main-container">
            <p>Oop's! No</p>
            <div className="tooltip-container">
              
              <p> class rooms to show!</p>
            </div>
          </div>
        :
        <div className="item-con">
          {
            (searchTerm.length===0)? classRooms.map((cr,index)=>(
              <div className="con-item">
                <div className='crcard'>
                  <div className="icon">
                  <ion-icon name="newspaper-outline"></ion-icon>
                  </div>
                  <div className='info session'>
                      <p className="item-text title">{cr.name}</p>
                      <p className="item-text">{cr.description}</p>
                  </div>
                </div>
                <button className='join'>Join</button>
              </div>
          )):
          searchItems.map((cr,index)=>(
            <div className="con-item">
              <div className='crcard'>
                <div className="icon">
                <ion-icon name="newspaper-outline"></ion-icon>
                </div>
                <div className='info session'>
                    <p className="item-text title">{cr.name}</p>
                    <p className="item-text">{cr.description}</p>
                </div>
              </div>
              <button className='join'>Join</button>
            </div>
          ))
        }
        </div>
        
      }
    </div>
  )
}
