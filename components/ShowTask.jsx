import React, { useEffect, useState } from 'react'
import useStore from '../store/store'

export const ShowTask = () => {
    const {taskItem,setTaskItem,setMessage,setIsLoading}=useStore();
    const [showProps,setShowProps]=useState(false)
    const [questions,setQuestions]=useState([])
    const [question,setQuestion]=useState({
        quizId:-1,
        taskId:taskItem.id,
        description:"",
        answer:""
    });
    console.log(taskItem)
    useEffect(()=>{
        const token=sessionStorage.getItem("token");
        if(token!==null){
        setIsLoading(true);
        const fetchData=async()=>{
            const res = await fetch(`http://localhost:3000/faculty/taskquestion/${taskItem.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                });
                if (res.ok) {
                const response = await res.json();
                console.log(response);
                setQuestions(response);
                } else
                setMessage({ color: "crimson", message: "Network error" });
        }
        fetchData();
        setIsLoading(false)
        }
    },[])
    const [displayForm,setDisplayForm]=useState(false)
    const handleDelete=async(id)=>{
        const token=sessionStorage.getItem("token");
        if(token!==null){
            setIsLoading(true);
            const res = await fetch(`http://localhost:3000/faculty/taskquestion/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                });
                if (res.ok) {
                const response = await res.json();
                setQuestions(response);
                } else
                setMessage({ color: "crimson", message: "Network error" });
            setIsLoading(false)
        }
    }
    const handleChange=(e)=>{
        setTaskItem({...taskItem,[e.target.name]:e.target.value})
    }
    const handleSubmit=async()=>{
        if((question.answer.length===0 && !taskItem.eval) || question.description.length===0 ){
            setMessage({color:"green", message:"please provide answer"})
        }else{
            const token=sessionStorage.getItem("token");
            if(token!==null){
                setIsLoading(true);
                const res = await fetch("http://localhost:3000/faculty/question", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(question),
                });
                if (res.ok) {
                const response = await res.json();
                setQuestions(response);
                setMessage({color: "green", message: "created successfully"})
                } else
                setMessage({ color: "crimson", message: "Network error" });
                setIsLoading(false)
                setDisplayForm(false)
            }
        }
    }
    const handleUpdate=async()=>{
        setIsLoading(true);
        try {
        const token = sessionStorage.getItem("token");
        const res = await fetch("http://localhost:3000/faculty/task", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskItem),
        });
        if (res.ok) {
            const response = await res.json();
            console.log(response);
            setMessage({ color: "green", message: response.body });
        } else
            setMessage({ color: "crimson", message: "error creating" });
        } catch (error) {
        setMessage({ color: "crimson", message: "network error" });
        } finally {
        setIsLoading(false);
        }
    }
return (
    <div className='quiz-item'>
        {showProps && <div className="show-prop">
                            <div className="cancel-form" onClick={()=>{setShowProps(false)}}>x</div>
                            <div className="prop-header">
                                <h3>Properties</h3>
                            </div>
                            <div className="prop-container">
                                <p>Title: <br /> <textarea  onChange={handleChange} name='title' type="text" value={taskItem.title}/></p>
                                <p>Description: <br /> <textarea onChange={handleChange} name='description' type="text" value={taskItem.description}/></p>
                                <p>Marks: <input onChange={handleChange} type="number" name='marks' value={taskItem.marks}/></p>
                            </div>
                            <button onClick={handleUpdate} className='edit'>Edit</button>
                        </div>}
        <div className="quiz-header">
            <div className="icon">
                <ion-icon name="newspaper-outline"></ion-icon>
            </div>
            <div className="quiz-info">
                <h3>{taskItem.title}</h3>
                <p className='description'>{taskItem.description}</p>
            </div>
        </div>
        <div className="props" onClick={()=>{setShowProps(true)}}>
            <button>Show Properties</button>
        </div>
        <hr />
        <div className="questions">
            <div className="q-header">
                <h2>Questions({questions.length})</h2>
                {!displayForm?<button className="newcr" onClick={()=>{setDisplayForm(true)}}>Create</button>:
                <button className="newcr" onClick={handleSubmit}>Save</button>
                }
            </div>
            {displayForm && <>
                <form className='question-form' onSubmit={(e)=>{e.preventDefault()}}>
                <div className="question-form">
                    <textarea autoFocus placeholder='Enter your question..' type="text" name="description" id="taskQ" required  onChange={(e)=>{setQuestion({...question,description:e.target.value})}}/>
                    {
                        !taskItem.eval && <textarea placeholder='Enter your answer/test cases...'  type="text" name="answer" id="taskQ" required  onChange={(e)=>{setQuestion({...question,answer:e.target.value})}}/>
                    }
                </div>
                </form>
            </>}
            {
                questions.length===0?<>
                <div className="oops">no questions</div>
                </>:
                questions.map((q,index)=>(
                    <div key={index} className="question-container">
                        <div className="q-des">
                            <div className="q-des-con">
                                <p>{q.description}?</p>
                                <p>{q.answer}</p>
                            </div>
                            <button onClick={()=>{handleDelete(q.id)}} aria-label="Delete item" className="delete-button">
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
                    </div>
                ))
            }
            
        </div>
    </div>
)
}
