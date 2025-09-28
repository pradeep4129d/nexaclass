import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { data } from 'react-router-dom';

export const Home = () => {
  const {setMessage,setIsLoading,userData}=useStore()
  const [classRooms,setClassRooms]=useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const [classMembers,setClassMembers]=useState(new Set());
  const [searchItems,setSearchItems]=useState([]);
  const handleJoin=async(index)=>{
    const currentList = searchTerm.length === 0 ? classRooms : searchItems;
    const classRoomId = currentList[index].id;
    if (classMembers.has(classRoomId)) {
      setMessage({ color: "crimson", message: "You are already a member of this class" });
      return;
    }
    setIsLoading(true);
    const token=sessionStorage.getItem("token");
    if(token==null){
      return;
    }
    const res=await fetch("http://localhost:3000/student/join",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId:userData.id,
          classRoomId:classRooms[index].id
        })
      });
      if(res.ok){
        const data=await res.json();
        setClassMembers(new Set(data.map((member)=>member.classRoomId)));
        console.log(data)
        setMessage({color:"green",message:"joined successfully"});
      } else{
        setMessage({color:"crimson",message:data.message});
      }
    setIsLoading(false);
  }
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
    const fetchMembers=async()=>{
      const res=await fetch("http://localhost:3000/student/classmembers",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if(res.ok){
        const data=await res.json();
        setClassMembers(new Set(data.map((member)=>member.classRoomId)));
      }
    }
    fetchMembers();
  },[])
  const handleSearch=(e)=>{
    setSearchTerm(e.target.value);
    const filteredItems=classRooms.filter((cr)=>
      cr.name.toLowerCase().includes(e.target.value.toLowerCase()) || cr.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchItems(filteredItems);
  }
  const currentList = searchTerm.length === 0 ? classRooms : searchItems;
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
            ((searchTerm.length===0)?classRooms:searchItems).map((cr,index)=>(
              <div className="con-item" key={index}>
                <div className='crcard'>
                  <div className="icon">
                  <ion-icon name="albums-outline"></ion-icon>
                  </div>
                  <div className='info session'>
                      <p className="item-text title">{cr.name}</p>
                      <p className="item-text">{cr.description}</p>
                  </div>
                </div>
                <button
                      className={"join " + (classMembers.has(currentList[index].id) ? "joined" : "")}
                      onClick={() => handleJoin(index)}>
                      {classMembers.has(currentList[index].id) ? "Joined" : "Join"}
                </button>
              </div>
          ))
        }
        </div>
        
      }
    </div>
  )
}
