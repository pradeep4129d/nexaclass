import React, { useEffect, useState } from 'react'
import useStore from '../store/store';

export const MyNotes = () => {
    const { setIsLoading, setMessage ,userData} = useStore();
    const [note,setNote]=useState({
        studentId:userData.id,
        note:"",
        content:""
    })
    const [notes, setNotes] = useState([]);
    const [displayForm, setDisplayForm] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const token = sessionStorage.getItem("token");
                const res = await fetch(`http://localhost:3000/student/mynotes`, {
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
    }, [])
    return (
        <div className='tab-con mynotes'>
            <h3>My Notes</h3>
            <button className="newcr" onClick={() => { setDisplayForm(true) }}>New</button>
            {displayForm &&
                <div className='note-form'>
                    <div className='con-item mynotes'>
                        <input type="text" placeholder='Note..' value={note.note} onChange={(e)=>{setNote({...note,note:e.target.value})}}/>
                        <hr className='hrnotes'/>
                        <textarea name="" placeholder='content...' value={note.content} onChange={(e)=>{setNote({...note,content:e.target.value})}} cols={30} id=""></textarea>
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
                                    <div className='crcard'>
                                        <div className="icon">
                                            <ion-icon name="calendar-outline"></ion-icon>
                                        </div>
                                        <div className='info session'>
                                            <p className="item-text title">{note.note}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                }
            </div>
        </div>
    )
}
