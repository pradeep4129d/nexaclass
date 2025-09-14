import React, { useState } from 'react'
import useStore from '../store/store'

export const ShowQuiz = () => {
    const {quizItem}=useStore()
    const [questions,setQuestions]=useState([]);
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
                <h2>Questions</h2>
                <button className="newcr" onClick={()=>{setDisplayForm(true)}}>Create</button>
            </div>
            {
                questions.length===0?<>
                <div className="oops">no questions</div>
                </>:
                questions.map(()=>(
                    <div className="question"></div>
                ))
            }
        </div>
    </div>
)
}
