import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';

export const Tasks = () => {
  const {userData,setIsLoading,setMessage,setTaskItem}=useStore();
  const [tasks,setTasks]=useState([]);
  const [displayForm,setDisplayForm]=useState(false);
  const navigate=useNavigate()
  const [taskForm,setTaskForm]=useState({
    facultyId:userData.id,
    title:"",
    description:"",
    marks:0,
    eval:false
  })
  useEffect(()=>{
    const token=sessionStorage.getItem("token");
    if(token!==null && tasks.length===0){
      setIsLoading(true);
      const fetchData=async()=>{
        const res = await fetch("http://localhost:3000/faculty/task", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            });
            if (res.ok) {
              const response = await res.json();
              console.log(response);
              setTasks(response);
            } else
              setMessage({ color: "crimson", message: "Network error" });
      }
      fetchData();
      setIsLoading(false)
    }
  },[])
  const handleSubmit=async(e)=>{
    e.preventDefault();
      setIsLoading(true)
          try {
            const token = sessionStorage.getItem("token");
            const res = await fetch("http://localhost:3000/faculty/task", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(taskForm),
            });
            if (res.ok) {
              const response = await res.json();
              setTasks(response);
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
  const handlechange=(e)=>{
        setTaskForm({...taskForm,[e.target.name]:e.target.value})
  }
  const handleDelete=async(id)=>{
     const token=sessionStorage.getItem("token");
        if(token!==null){
            setIsLoading(true);
            const res = await fetch(`http://localhost:3000/faculty/task/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                });
                if (res.ok) {
                const response = await res.json();
                console.log(response);
                setTasks(response);
                setMessage({color: "green", message: "deleted successfully"})
                } else
                setMessage({ color: "crimson", message: "Network error" });
            setIsLoading(false)
        }
  }
  console.log(taskForm)
  return (
    <>
    <button className="newcr" onClick={()=>{setDisplayForm(true)}}>New</button>
    <div className='tasks'>
      {displayForm && <div className="CRForm">
          <div className="popup">
            <div className="cancel-form" onClick={()=>{setDisplayForm(false)}}>x</div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="icon">
                <ion-icon name="reader-outline"></ion-icon>
              </div>
              <div className="note">
                <label className="title">Set up Task properties</label>
              </div>
              <input required onChange={handlechange} placeholder="title"  name="title" type="text" className="input_field"/>
              <input required onChange={handlechange} placeholder="description"  name="description" type="text" className="input_field"/>
              <input required onChange={handlechange} placeholder="marks"  name="marks" type="number" className="input_field"/>              
              <button className="submit" type='submit'>Create</button>
            </form>
          </div>
      </div>}
      {
        tasks.length===0?<>
          <div className="main-container">
            <p>Oop's! No</p>
            <div className="tooltip-container">
              <span className="tooltip">Create</span>
              <div className="text" onClick={()=>{setDisplayForm(true)}}>Tasks</div>
              <p>to show!</p>
            </div>
          </div>
        </>:
        <>
          {
            tasks.map((task,index)=>(
              <div className='item' key={index} >
                <div className='crcard'>
                    <div className="icon">
                    <ion-icon name="reader-outline"></ion-icon>
                    </div>
                    <div className='info session' onClick={()=>{
                      setTaskItem(task)
                      navigate('/task')
                    }}>
                        <p className="item-text title">{task.title}</p>
                        <p className="item-text">{task.description}</p>
                    </div>
                </div>
            <button onClick={()=>{handleDelete(task.id)}} aria-label="Delete item" className="delete-button">
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
        </>
      }
    </div>
    </>
  )
}
