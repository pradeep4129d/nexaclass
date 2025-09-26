import React, { useState } from 'react'
import useStore from '../store/store';

export const Session = () => {
  const {userData,setIsLoading,setMessage,sItem}=useStore();
  const [displayForm,setDisplayForm]=useState(false);
  const [activities,setActivities]=useState([]);
  const [allActivities,setAllActivities]=useState([])
  const [activity,setActivity]=useState({
    facultyId:userData.id,
    sessionId:sItem.id,
    type:"",
    activityId:null,
    isTest:false,
    includeEditor:false,
    start:null,
    end:null
  })
  const handleSubmit=async(e)=>{
    e.preventDefault();
        setIsLoading(true)
        try {
          const token = sessionStorage.getItem("token");
          const res = await fetch("http://localhost:3000/faculty/activity", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(activity),
          });
          if (res.ok) {
            const response = await res.json();
            console.log(response)
            setActivities(response);
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
  const fetchActivities=async()=>{
    const token=sessionStorage.getItem("token");
    setIsLoading(true);
    if(activity.type==="quiz"){
      const res = await fetch("http://localhost:3000/faculty/quiz", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          });
      if (res.ok) {
        const response = await res.json();
        setAllActivities(response);
      } else
        setMessage({ color: "crimson", message: "Network error" });
    }else if(activity.type==="task"){
      const res = await fetch("http://localhost:3000/faculty/task", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          });
      if (res.ok) {
        const response = await res.json();
        setAllActivities(response);
      } else
        setMessage({ color: "crimson", message: "Network error" });
    }
    setIsLoading(false);
  }
  const handlechange=(e)=>{
    setActivity({...activity,[e.target.name]:e.target.value})
  }
  console.log(activity)
  return (
    <div className='activity'>
      <button className="newcr" onClick={()=>{setDisplayForm(true)}}>New</button>
      {displayForm && <div className="CRForm">
          <div className="popup">
            <div className="cancel-form" onClick={()=>{setDisplayForm(false)}}>x</div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="icon">
                <ion-icon name="document-text-outline"></ion-icon>
              </div>
              <div className="note">
                <label className="title">Set up properties</label>
                <span className="subtitle">Activity properties cannot be updatable onces created.</span>
              </div>
              <select  id='cb' onClick={fetchActivities} value={activity.type} name='type' required onChange={handlechange} className="input_field">
                            <option value="">-- Activity Type --</option>
                            <option value="quiz">Quiz</option>
                            <option value="task">Task</option>
              </select>
            <select  id='cb'  name='activityId' required onChange={handlechange} className="input_field">
                            <option value="">-- choose {activity.type} --</option>
                            {
                              allActivities.map((a,index)=>(
                                  <option value={a.id}>{a.title}</option>
                              ))
                            }
              </select>
              <div className="checks">
                <label htmlFor="isTest">Mark as test:</label>
                <input  onChange={handlechange} value={JSON.parse(activity.isTest)?false:true} id='check' name="isTest" type="checkbox" className="input_field"/>
              </div>
              <div className="checks">
                <label htmlFor="includeEditor">Include Code Editor:</label>
                <input  onChange={handlechange}value={JSON.parse(activity.includeEditor)?false:true} id='check' name="includeEditor" type="checkbox" className="input_field"/>
              </div>
              <label htmlFor="start">Start Time</label>
              <input required onChange={handlechange} name="start" type="datetime-local" className="input_field"/>
              <label htmlFor="end">End Time</label>
              <input required onChange={handlechange} name="end" type="datetime-local" className="input_field"/>
              <button className="submit" type='submit'>Create</button>
            </form>
          </div>
      </div>}
      {
        activities.length===0 && !displayForm?<>
          <div className="main-container">
            <p>Oop's! No</p>
            <div className="tooltip-container">
              <span className="tooltip">Create</span>
              <div className="text" onClick={()=>{setDisplayForm(true)}}>acctivities</div>
              <p>to show!</p>
            </div>
          </div>
        </>:<>
        </>
      }
    </div>
  )
}
