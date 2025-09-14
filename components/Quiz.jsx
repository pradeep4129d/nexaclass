import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';

export const Quiz = () => {
  const {userData,setIsLoading,setMessage,setQuizItem}=useStore()
  const [quizes,setQuizes]=useState(null);
  const [displayForm,setDisplayForm]=useState(false)
  const navigate=useNavigate();
  const [formData,setFormData]=useState({
    facultyId:userData.id,
    title:"",
    description:"",
    marksForCorrect:"",
    negativeMarks:"",
    passingMarks:""
  })
  useEffect(()=>{
    const fetchData=async()=>{
      setIsLoading(true);
      const token=sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3000/faculty/quiz", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          });
      if (res.ok) {
        const response = await res.json();
        setQuizes(response);
      } else
        setMessage({ color: "crimson", message: "Network error" });
      setIsLoading(false);
    }
    fetchData();
  },[])
  const handleDelete=async(index)=>{
    setIsLoading(true);
      try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/faculty/quiz/${quizes[index].id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }});
      if (res.ok) {
        const response = await res.json();
        console.log(response)
        setQuizes(response);
        setMessage({ color: "green", message: "Deleted successfully" });
      } else
        setMessage({ color: "crimson", message: "error creating" });
    } catch (error) {
      setMessage({ color: "crimson", message: "network error" });
    } finally {
      setIsLoading(false);
    }
  }
  const handlechange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setIsLoading(true)
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3000/faculty/quiz", {
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
        setQuizes(response);
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
    <>
    <button className="newcr" onClick={()=>{setDisplayForm(true)}}>New</button>
    <div className='quiz-container'>
      {displayForm && <div className="CRForm">
          <div className="popup">
            <div className="cancel-form" onClick={()=>{setDisplayForm(false)}}>x</div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="icon">
                <ion-icon name="newspaper-outline"></ion-icon>
              </div>
              <div className="note">
                <label className="title">Create Quiz</label>
              </div>
              <input required onChange={handlechange} placeholder="Title"  name="title" type="text" className="input_field"/>
              <input  onChange={handlechange} placeholder="description"  name="description" type="textbox" className="input_field"/>  
              <input required onChange={handlechange} placeholder="Marks for correct"  name="marksForCorrect" type="number" className="input_field"/>
              <input required onChange={handlechange} placeholder="Negative Marks"  name="negativeMarks" type="number" className="input_field"/>
              <input required onChange={handlechange} placeholder="Passing Marks"  name="passingMarks" type="number" className="input_field"/>
              <button className="submit" type='submit'>Create</button>
            </form>
          </div>
      </div>}
      {
        (quizes===null || quizes.length===0)?
        <>
          <div className="main-container">
            <p>Oop's! No</p>
            <div className="tooltip-container">
              <span className="tooltip">Create</span>
              <div className="text" onClick={()=>{setDisplayForm(true)}}>Quizes</div>
              <p>to show!</p>
            </div>
          </div>
        </>:
        quizes.map((quiz,index)=>(
          <div className='item' key={index} onClick={()=>{
                      setQuizItem(quizes[index])
                      navigate('/quiz')
                    }}>
            <div className='crcard'>
                <div className="icon">
                <ion-icon name="newspaper-outline"></ion-icon>
                </div>
                <div className='info session'>
                    <p className="item-text title">{quiz.title}</p>
                    <p className="item-text">{quiz.description}</p>
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
    </div></>
  )
}
