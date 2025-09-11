import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import Loading from './Loading';
import AnimatedList from './AnimatedList';

export const ClassRoom = () => {
  const {isLoading,setIsLoading,setMessage,userData}=useStore();
  const [classRoom,setClassRoom]=useState(null);
  const [displayForm,setDisplayForm]=useState(false);
  const [formData,setFormData]=useState({
        facultyId:userData.id,
        name:"",
        description:"",
        branch:"",
        semester:"",
        section:""
    });
  useEffect(()=>{
    const token=sessionStorage.getItem("token");
    if(token!==null && classRoom===null){
      setIsLoading(true);
      const fetchData=async()=>{
        const res = await fetch("http://localhost:3000/faculty/classroom", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            });
            if (res.ok) {
              const response = await res.json();
              console.log(response);
              setClassRoom(response);
            } else
              setMessage({ color: "crimson", message: "Network error" });
      }
      fetchData();
      setIsLoading(false)
    }
  },[])
  function isBetween(ch) {
        return ch >= '1' && ch <= '8';
    }
  function isAlphabet(char) {
        return /^[A-Za-z]$/.test(char);
    }
  const handlechange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }
  const handleSubmit=async(e)=>{
      e.preventDefault();
      if(formData.semester.length>1 || !isBetween(formData.semester)){
            setMessage({color:"crimson",message:"semester number must be 1-8"})}
      else if(formData.section.length>1 || !isAlphabet(formData.section)){
            setMessage({color:"crimson",message:"section must be an alphabet"})
      }else{
          setIsLoading(true)
          try {
            const token = sessionStorage.getItem("token");
            const res = await fetch("http://localhost:3000/faculty/classroom", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formData),
            });
            if (res.ok) {
              const response = await res.json();
              setClassRoom(response);
              setDisplayForm(false);
              setMessage({ color: "green", message: "created successfully" });
            } else
              setMessage({ color: "crimson", message: "error creating" });
          } catch (error) {
            setMessage({ color: "crimson", message: "network error" });
          } finally {
            setIsLoading(false);
          }
      }
  }
  return (
    <>
    <div className='classroom-container'>
      <button className="newcr" onClick={()=>{setDisplayForm(true)}}>New</button>
      {displayForm && <div className="CRForm">
          <div className="popup">
            <div className="cancel-form" onClick={()=>{setDisplayForm(false)}}>x</div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="icon">
                <ion-icon name="albums-outline"></ion-icon>
              </div>
              <div className="note">
                <label className="title">Set up properties</label>
                <span className="subtitle">Class Room properties cannot be updatable onces created.</span>
              </div>
              <input required onChange={handlechange} placeholder="Class room name"  name="name" type="text" className="input_field"/>
              <input  onChange={handlechange} placeholder="description"  name="description" type="textbox" className="input_field"/>
              <select  id='cb' value={formData.branch} name='branch' required onChange={handlechange} className="input_field">
                            <option value="">-- Branch --</option>
                            <option value="CSE">CSE</option>
                            <option value="CST">CST</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
              </select>
              <input required onChange={handlechange} placeholder="semester"  name="semester" type="number" className="input_field"/>
              <input required onChange={handlechange} placeholder="section"  name="section" type="text" className="input_field"/>
              <button className="submit" type='submit'>Create</button>
            </form>
          </div>
      </div>}
      {
        (classRoom===null)?
        <>
          <div className="main-container">
            <p>Oop's! No</p>
            <div className="tooltip-container">
              <span className="tooltip">Create</span>
              <div className="text" onClick={()=>{setDisplayForm(true);}}>Class Rooms</div>
              <p>to show!</p>
            </div>
          </div>
        </>:
        <>
          <AnimatedList
            items={classRoom}
            onItemSelect={(item, index) => console.log(item, index)}
            showGradients={false}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        </>
      }
    </div>
    </>
  )
}
