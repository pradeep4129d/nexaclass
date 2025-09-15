import React, { useEffect, useState } from 'react'
import useStore from '../store/store'

export const ShowQuiz = () => {
    const {quizItem,setIsLoading,setMessage}=useStore()
    const [questions,setQuestions]=useState([]);
    const [question,setQuestion]=useState({
        quizId:quizItem.id,
        taskId:-1,
        description:"",
        answer:"0",
        options:[]
    })
    const handleDelete=async(index)=>{
        const token=sessionStorage.getItem("token");
        if(token!==null){
            setIsLoading(true);
            const res = await fetch(`http://localhost:3000/faculty/question/${questions[index].id}`, {
            method: "DELETE",
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
            setIsLoading(false)
        }
    }
    useEffect(()=>{
        const token=sessionStorage.getItem("token");
            if(token!==null){
            setIsLoading(true);
            const fetchData=async()=>{
                const res = await fetch(`http://localhost:3000/faculty/question/${quizItem.id}`, {
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
    },[quizItem.id])
    const handleSubmit=async()=>{
        if(question.options.length===0)
            setMessage({ color: "crimson", message: "please add options"})
        else{
            setIsLoading(true);
            try {
            const token = sessionStorage.getItem("token");
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
                console.log(response)
                setQuestions(response);
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
    const [displayForm,setDisplayForm]=useState(false)
return (
    <div className='quiz-item'>
        <div className="quiz-header">
            <div className="icon">
                <ion-icon name="newspaper-outline"></ion-icon>
            </div>
            <div className="quiz-info">
                <h3>{quizItem.title}</h3>
                <p className='description'>{quizItem.description}</p>
            </div>
        </div>
        <div className="props">
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
                    <input placeholder='Enter your question..' type="text" name="description" id="" required  onChange={(e)=>{setQuestion({...question,description:e.target.value})}}/>
                    {
                        question.options.length>0 && question.options.map((option,index)=>(
                            <div className="option">
                                <input  type="text" placeholder='Enter your option' value={question.options[index].description} onChange={(e)=>{
                                setQuestion({...question,
                                options: question.options.map((opt, i) =>
                                    i === index ? { ...opt, description: e.target.value } : opt
                                )
                                });}} required key={index} id={index} />
                                <label class="checkbox">
                                    <input onClick={()=>{setQuestion({...question,answer:index+""})}} hidden=""  type="radio" checked={question.answer==index} />
                                    <svg viewBox="0 0 44 44" class="sizer checkmark">
                                        <path
                                        d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758"
                                        transform="translate(-2.000000, -2.000000)"
                                        ></path>
                                    </svg>
                                </label>
                                <button onClick={()=>{setQuestion((prev) => ({
                                                    ...prev,
                                                    options: prev.options.filter((_, i) => i !== index),}))}} aria-label="Delete item" className="delete-button">
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
                </div>
                <button type='submit' onClick={() => {
                                                    setQuestion({
                                                    ...question,
                                                    options: [
                                                        ...question.options,
                                                        {
                                                        questionId: -1,
                                                        description: "",
                                                        },
                                                    ],
                                                    });
                                                }} className='add-option'>Add Option</button>
                </form>
            </>}
            {
                questions.length===0?<>
                <div className="oops">no questions</div>
                </>:
                questions.map((q,index)=>(
                    <div key={index} className="question-container">
                        <div className="q-des">
                            <p>{q.description}?</p>
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
                        {
                            q.options.map((option,index)=>(
                                <div className={`q-options ${q.answer==index?"correct":"wrong"}`}>
                                    {option.description}
                                </div>
                            ))
                        }
                    </div>
                ))
            }
            
        </div>
    </div>
)
}
