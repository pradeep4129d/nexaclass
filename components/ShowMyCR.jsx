import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const ShowMyCR = () => {
    const { setMessage, setIsLoading, myCrItem, setMySessionItem } = useStore();
    const location = useLocation()
    const [show, setShow] = useState(false);
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === "/mycr/cr/session")
            setShow(true);
        else
            setShow(false);
    }, [location.pathname])
    const checkSessionStatus = (session) => {
        const now = new Date();
        const start = new Date(session.start);
        const end = new Date(session.end);
        if (now < start) return "upcoming";
        if (now > end) return "ended";
        return "live";
    };
    const sortedSessions = [...sessions].sort((a, b) => {
        const statusPriority = { live: 1, upcoming: 2, ended: 3 };
        const diff = statusPriority[checkSessionStatus(a)] - statusPriority[checkSessionStatus(b)];
        if (diff !== 0) return diff;
        return new Date(a.start) - new Date(b.start);
    });
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token == null) {
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            const res = await fetch(`http://localhost:3000/student/session/${myCrItem.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setSessions(data);
            } else {
                setMessage({ color: "crimson", message: "Network error" });
            }
            setIsLoading(false);
        }
        fetchData();
    }, [])
    return (
        <>
            <Outlet />
            <div className={'tab-con ' + (show ? 'show' : '')}>
                <div className="notification">
                    <div className="notiglow"></div>
                    <div className="notiborderglow"></div>
                    <div className="notititle">Class Room: {myCrItem?.name}</div>
                    <div className="notibody">description: {myCrItem?.description}</div>
                </div>
                <div className="mycr-sessions">
                    <h3>Sessions</h3>
                    <div className="item-con">
                        {
                            sessions.length === 0 ?
                                <div className="main-container">
                                    <p>Oop's! No</p>
                                    <div className="tooltip-container">
                                        <p> sessions to show!</p>
                                    </div>
                                </div> : sortedSessions.map((session, index) => (
                                    <div className={'con-item smcr ' + checkSessionStatus(session)} key={index}
                                        onClick={() => {
                                            const status = checkSessionStatus(session);
                                            if (status === "live") {
                                                setMySessionItem(session);
                                                setShow(true);
                                                navigate("/mycr/cr/session");
                                            }
                                        }} >
                                        <div className='crcard'>
                                            <div className="icon">
                                                <ion-icon name="calendar-outline"></ion-icon>
                                            </div>
                                            <div className='info session'>
                                                <p className="item-text title">{session.title}</p>
                                                <p className="item-text">Start Time:<br />{session.start}</p>
                                                <p className="item-text">End Time:<br />{session.end}</p>
                                            </div>
                                        </div>
                                        <div className={"status " + checkSessionStatus(session)}>
                                            <span></span>
                                            {checkSessionStatus(session)}
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShowMyCR