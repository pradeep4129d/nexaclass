import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const MyCRs = () => {
    const { setMessage, setIsLoading, userData,setMyCrItem } = useStore();
    const [classRooms, setClassRooms] = useState([]);
    const [show,setShow]=useState(false);
    const location=useLocation()
    const navigate=useNavigate()
    useEffect(()=>{
        if(location.pathname==="/mycr/cr" || location.pathname==="/mycr/cr/session")
            setShow(true);
        else
            setShow(false);
    },[location.pathname])
    const handleLeave = async (index) => {
        const token = sessionStorage.getItem("token");
        if (token == null) {
            return;
        }
        setIsLoading(true);
        const res = await fetch(`http://localhost:3000/student/classmembers/${classRooms[index].id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (res.ok) {
            const response = await res.json();
            setMessage({ color: "green", message: "left successfully" });
            setClassRooms(response);
        } else
            setMessage({ color: "crimson", message: res.body });
        setIsLoading(false)
    }
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token == null) {
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            const res = await fetch("http://localhost:3000/student/joinedclasses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setClassRooms(data);
            } else {
                setMessage({ color: "crimson", message: "Network error" });
            }
            setIsLoading(false);
        }
        fetchData();
    }, [])
    return (
        <>
        <Outlet/>
        <div className={'tab-con '+(show ? 'mycrs' : '')}>
            <h2>My Class Rooms</h2>
            {
                classRooms.length === 0 ?
                    <div className="main-container">
                        <p>Oop's! No</p>
                        <div className="tooltip-container">
                            <p> class rooms to show!</p>
                        </div>
                    </div>
                    :
                    <div className="item-con">
                        {classRooms.map((cr, index) => (
                            <div className="con-item" key={index}>
                                <div className='crcard' onClick={()=>{setMyCrItem(cr);setShow(true);navigate("/mycr/cr")}}>
                                    <div className="icon">
                                        <ion-icon name="albums-outline"></ion-icon>
                                    </div>
                                    <div className='info session'>
                                        <p className="item-text title">{cr.name}</p>
                                        <p className="item-text">{cr.description}</p>
                                    </div>
                                </div >
                                <div className='leavebtn' onClick={()=>{handleLeave(index)}}>
                                    <ion-icon name="log-out-outline"></ion-icon>
                                </div>
                            </div>
                        ))}
                    </div>
            }
        </div>
        </>
    )
}
