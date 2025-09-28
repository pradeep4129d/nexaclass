import React, { useEffect, useState } from 'react'
import useStore from '../store/store'
import { useNavigate } from 'react-router-dom';

export const ShowCR = () => {
  const {crItem,setIsLoading,setMessage,setSItem}=useStore();
  const [sessions,setSessions]=useState(null)
  const [displayForm,setDisplayForm]=useState(false);
  const navigate=useNavigate();
  const [formData,setFormData]=useState({
    classRoomId:crItem.id,
    title:"",
    start:"",
    end:""
  })
const handleDelete=async(index)=>{
  setIsLoading(true)
  try {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/faculty/session/${sessions[index].id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    if (res.ok) {
      const response = await res.json();
      setSessions(response);
      setMessage({ color: "green", message: "Deleted successfully" });
    } else
      setMessage({ color: "crimson", message: "error deleting" });
    } catch (error) {
      setMessage({ color: "crimson", message: "network error" });
    } finally {
      setIsLoading(false);
    }
}
  useEffect(()=>{
    const fetchData=async()=>{
        setIsLoading(true)
        try {
          const token = sessionStorage.getItem("token");
          const res = await fetch(`http://localhost:3000/faculty/session/${crItem.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          });
          if (res.ok) {
            const response = await res.json();
            console.log(response)
            setSessions(response);
          }
          } catch (error) {
            setMessage({ color: "crimson", message: "network error" });
          } finally {
            setIsLoading(false);
          }
    }
    fetchData();
  },[])
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
            console.log(response)
            setSessions(response);
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
  return (
    <div className='showcr'>
      {displayForm && <div className="CRForm">
          <div className="popup">
            <div className="cancel-form" onClick={()=>{setDisplayForm(false)}}>x</div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="icon">
                <ion-icon name="calendar-outline"></ion-icon>
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
      <div className='scon'>
        <div className="group">
          <div className="container">
          <div className="box">
            <span className="title session">{crItem.name}</span>
            <div>
              <p>{crItem.description}</p>
            </div>
          </div>
          </div>
          <div className="container">
          <div className="box">
            <span className="title session">Class Members</span>
            <div className='propdetails'>
              <p>Total class Members:0 <a href="">View Members</a></p>
            </div>
          </div>
          </div>
        </div>
      <div className="container">
        <div className="box">
          <span className="title session">Properties</span>
          <div className='propdetails props'>
            <p>branch: {crItem.branch}</p>
            <p>section: {crItem.section}</p>
            <p>semester: {crItem.semester}</p>
          </div>
        </div>
      </div>
      </div>
      <div className="container">
        <div className="box">
          <span className="title session">Sessions</span>
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
                <div className="sessions-container">
                  {sessions.map((session,index)=>(
                    <div className='item' key={index} >
                      <div className='crcard'>
                          <div className="icon">
                          <ion-icon name="calendar-outline"></ion-icon>
                          </div>
                          <div className='info session' onClick={()=>{
                      setSItem(sessions[index])
                      navigate("/session")
                    }}>
                              <p className="item-text title">{session.title}</p>
                              <p className="item-text">Start Time:<br/>{session.start}</p>
                              <p className="item-text">End Time:<br/>{session.end}</p>
                          </div>
                      </div>
                      <button onClick={()=>{handleDelete(index)}} aria-label="Delete item" className="delete-button">
                        <svg
                            class="trash-svg"
                            viewBox="0 -10 64 74"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="trash-can">
                            <rect
                                x="16"
                                y="24"
                                width="32"
                                height="30"
                                rx="3"
                                ry="3"
                                fill="#e74c3c"
                            ></rect>

                            <g transform-origin="12 18" id="lid-group">
                                <rect
                                x="12"
                                y="12"
                                width="40"
                                height="6"
                                rx="2"
                                ry="2"
                                fill="#c0392b"
                                ></rect>
                                <rect
                                x="26"
                                y="8"
                                width="12"
                                height="4"
                                rx="2"
                                ry="2"
                                fill="#c0392b"
                                ></rect>
                            </g>
                            </g>
                        </svg>
                    </button>
                    </div>
                  ))
                }
                <button className='newcr' onClick={()=>{setDisplayForm(true)}}>New</button>
                </div>
                </>
            }
          </div>
        </div>
      </div>
      
    </div>
  )
}
