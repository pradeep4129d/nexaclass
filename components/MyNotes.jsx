import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const MyNotes = () => {
    const { setIsLoading, setMessage, userData ,setNoteItem} = useStore();
    const [show, setShow] = useState(false);
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (location.pathname === "/mynotes")
            setShow(true);
        else
            setShow(false);
    }, [location.pathname])
    const [note, setNote] = useState({
        studentId: userData.id,
        note: "",
        content: ""
    })
    const [notes, setNotes] = useState([]);
    const [displayForm, setDisplayForm] = useState(false);
    const handleDelete = async (id) => {
        setIsLoading(true)
        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/student/notes/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.ok) {
                const response = await res.json();
                setNotes(response);
                setMessage({ color: "green", message: "Note Deleted Successfully." })
            }
        } catch (error) {
            setMessage({ color: "crimson", message: "network error" });
        } finally {
            setIsLoading(false);
        }
    }
    const handleSubmit = async () => {
        setDisplayForm(false)
        setIsLoading(true)
        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/student/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(note)
            });
            if (res.ok) {
                const response = await res.json();
                setNotes(response);
                setMessage({ color: "green", message: "Note Created Successfully." })
                setNote({ studentId: userData.id, note: "", content: "" })
            }
        } catch (error) {
            setMessage({ color: "crimson", message: "network error" });
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const token = sessionStorage.getItem("token");
                const res = await fetch(`http://localhost:3000/student/notes`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (res.ok) {
                    const response = await res.json();
                    console.log(response)
                    setNotes(response);
                }
            } catch (error) {
                setMessage({ color: "crimson", message: "network error" });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [location.pathname])
    return (
        <>
        <Outlet/>
        <div className={'tab-con '+(show?"mynotes": "disable")}>
            <h3>My Notes</h3>
            {
                displayForm ?
                    <button className="newcr" onClick={handleSubmit}>Save</button>
                    :
                    <button className="newcr" onClick={() => { setDisplayForm(true) }}>New</button>
            }

            {displayForm &&
                <div className='note-form'>
                    <div className='con-item mynotes'>
                        <input type="text" placeholder='Note..' autoFocus={true} required={true} value={note.note} onChange={(e) => { setNote({ ...note, note: e.target.value }) }} />
                        <hr className='hrnotes' />
                        <textarea name="" placeholder='content...' value={note.content} onChange={(e) => { setNote({ ...note, content: e.target.value }) }} cols={30} id=""></textarea>
                    </div>
                </div>
            }
            <div className="item-con">
                {
                    notes.length === 0 ?
                        <div className="main-container">
                            <p>Oop's! No</p>
                            <div className="tooltip-container">
                                <p> Notes to show!</p>
                            </div>
                        </div> :
                        <div className="notes-con">
                            {notes.map((note, index) => (
                                <div className={'con-item smcr '} key={index}>
                                    <div className='crcard mynotes'>
                                        <div className="icon">
                                            <ion-icon name="clipboard-outline"></ion-icon>
                                        </div>
                                        <div className='info mynotes' onClick={()=>{setNoteItem(note);navigate("/mynotes/note")}}>
                                            <p className="item-text title">{note.note}</p>
                                        </div>
                                        <button onClick={() => { handleDelete(note.id) }} aria-label="Delete item" className="delete-button">
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
                            ))}
                        </div>
                }
            </div>
        </div></>
    )
}
