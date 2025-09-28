import React, { useEffect, useState } from 'react'
import useStore from '../store/store';

export const MySession = () => {
    const { mySessionItem } = useStore();
    const [activities, setActivities] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");

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
                <div className="item-con">
                    {
                    activities.length === 0 ?
                        <div className="main-container">
                            <p>Oop's! No</p>
                            <div className="tooltip-container">
                                <p> activities to show!</p>
                            </div>
                        </div> : 
                    activities.map((activity, index) => (
                        <div className={'con-item smcr '} key={index}>
                            <div className='crcard'>
                                <div className="icon">
                                    <ion-icon name="calendar-outline"></ion-icon>
                                </div>
                                <div className='info session'>
                                    <p className="item-text title">{activity.type}</p>                                        
                                </div>
                            </div>
                        </div>))}
                </div>
            </div>
        </div>
    )
}
