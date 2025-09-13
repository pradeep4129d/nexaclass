import React, { useState } from 'react'
import useStore from '../store/store'

export const ShowCR = () => {
  const {crItem}=useStore();
  const [sessions,setSessions]=useState(null)
  const [displayForm,setDisplayForm]=useState(false);
  const [formData,setFormData]=useState({
    classRoomId:crItem.id,
    title:"",
    start:"",
    end:""
  })
  const convertToDateTimeLocalString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
  const handlechange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleSubmit=async(e)=>{
      e.preventDefault();
        setIsLoading(true)
        try {
          const token = sessionStorage.getItem("token");
          const res = await fetch("http://localhost:3000/faculty/session", {
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
    <div className='showcr'>
      {displayForm && <div className="CRForm">
          <div className="popup">
            <div className="cancel-form" onClick={()=>{setDisplayForm(false)}}>x</div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="icon">
                <ion-icon name="albums-outline"></ion-icon>
              </div>
              <div className="note">
                <label className="title">Set up properties</label>
                <span className="subtitle">session properties cannot be updatable onces created.</span>
              </div>
              <input required onChange={handlechange} placeholder="Session Title"  name="title" type="text" className="input_field"/>
              <label htmlFor="start">Start Time</label>
              <input required onChange={handlechange} placeholder="description"  name="start" type="datetime-local" className="input_field"/>
              <label htmlFor="end">End Time</label>
              <input required onChange={handlechange} placeholder="semester"  name="end" type="datetime-local" className="input_field"/>
              <button className="submit" type='submit'>Create</button>
            </form>
          </div>
      </div>}
      <div className="container">
        <div className="box">
          <span className="title">{crItem.name}</span>
          <div>
            <p>{crItem.description}</p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="box">
          <span className="title">Properties</span>
          <div className='propdetails'>
            <p>branch: {crItem.branch}</p>
            <p>section: {crItem.section}</p>
            <p>semester: {crItem.semester}</p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="box">
          <span className="title">Sessions</span>
          <div className='propdetails'>
            {(sessions===null || sessions.length===0)?
                <>
                  <div className="main-container">
                    <p>Oop's! No</p>
                    <div className="tooltip-container">
                      <span className="tooltip">Create</span>
                      <div className="text session" onClick={()=>{setDisplayForm(true);}}>sessions</div>
                      <p>to show!</p>
                    </div>
                  </div>
                </>:<>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
