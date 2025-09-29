import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';

export const MySession = () => {
    const { mySessionItem ,setTestItem} = useStore();
    const [activities, setActivities] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");
    const navigate=useNavigate();
    const [attemptedTests,setAttemptedTests]=useState([]);
    const testActivities = activities.filter(item => item.test);
    const generalActivities = activities.filter(item => !item.test);
    const updateCountdown = () => {
        const now = new Date();
        const start = new Date(mySessionItem.start);
        const end = new Date(mySessionItem.end);
        if (now < start) {
            const diff = start - now;
            setTimeLeft(`Starts in: ${formatTime(diff)}`);
        } else if (now >= start && now <= end) {
            const diff = end - now;
            setTimeLeft(`Ends in: ${formatTime(diff)}`);
        } else {
            setTimeLeft("Session Ended");
        }
    };
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };
    useEffect(() => {
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [mySessionItem]);
    useEffect(() => {
        const fetchData = async () => {
            const token = sessionStorage.getItem("token");
            if (token == null) {
                return;
            }
            try {
                const res = await fetch(`http://localhost:3000/student/activities/${mySessionItem.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const response = await res.json();
                    setActivities(response);
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])
    return (
        <div className='tab-con showsession'>
            <div className="notification">
                <div className="notiglow"></div>
                <div className="notiborderglow"></div>
                <div className="notititle">Session: {mySessionItem?.title}</div>
                <div className="notibody">Session {timeLeft}</div>
            </div>
            <div className="mycr-sessions">
                <h3>Activities</h3>
                <div className="item-con a">
                    {
                        activities.length === 0 ?
                            <div className="main-container">
                                <p>Oop's! No</p>
                                <div className="tooltip-container">
                                    <p> activities to show!</p>
                                </div>
                            </div> :
                            <>
                                <div className="general-con">
                                    <div className="general-head">General Activities ({generalActivities.length})</div>
                                    {generalActivities.map((item, index) => (
                                        <div className={'con-item smcr '} key={index}>
                                            <div className='crcard'>
                                                <div className="icon">
                                                    <ion-icon name="reader-outline"></ion-icon>
                                                </div>
                                                <div className='info session'>
                                                    <p className="item-text title">{item.type === "quiz" ? item.quiz.title : item.task.title}</p>
                                                    <p className="item-text desc">{item.type === "quiz" ? item.quiz.description : item.task.description}</p>
                                                </div>
                                            </div>
                                            <button className='join' onClick={()=>{setTestItem(item);navigate("/test")}}>Attempt</button>
                                        </div>
                                    ))} 
                                </div>
                                <div className="general-con">
                                    <div className="general-head">Tests ({testActivities.length})</div>
                                    {testActivities.map((item, index) => (
                                        <div className={'con-item smcr'} key={index}>
                                            <div className='crcard'>
                                                <div className="icon">
                                                    <ion-icon name="newspaper-outline"></ion-icon>
                                                </div>
                                                <div className='info session'>
                                                    <p className="item-text title">{item.type === "quiz" ? item.quiz.title : item.task.title}</p>
                                                    <p className="item-text desc">{item.type === "quiz" ? item.quiz.description : item.task.description}</p>
                                                </div>
                                            </div>
                                            <button className='join' onClick={()=>{
                                                setTestItem(item);
                                                navigate("/test")}}>Attempt</button>
                                        </div>
                                    ))}
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}
