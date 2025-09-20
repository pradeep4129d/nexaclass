import React, { useState } from 'react'
import useStore from '../store/store'

export const ShowTask = () => {
    const {taskItem,setTaskItem}=useStore();
    const [showProps,setShowProps]=useState(false)
    const [questions,setQuestions]=useState([])
    const [displayForm,setDisplayForm]=useState(false)
    const handleDelete=async()=>{

    }
    const handleChange=(e)=>{
        setTaskItem({...setTaskItem,[e.target.name]:e.target.value})
    }
    const handleSubmit=async()=>{

    }
    const handleUpdate=async()=>{

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
                                <p>Marks: <input onChange={handleChange} type="text" name='marksForCorrect' value={taskItem.marks}/></p>
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
                    <textarea placeholder='Enter your question..' type="text" name="description" id="" required  onChange={(e)=>{setQuestion({...question,description:e.target.value})}}/>
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
