import React, { useState } from 'react'
import useStore from '../store/store'

const MyNote = () => {
    const { setIsLoading, setMessage, noteItem, setNoteItem } = useStore();
    const [chatLoading, setChatLoading] = useState(false)
    const handleSubmit = async () => {
        console.log(noteItem)
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/student/notes`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(noteItem)
            });
            if (res.ok) {
                setMessage({ color: "green", message: "Note updated Successfully." })
            }
        } catch (error) {
            setMessage({ color: "crimson", message: "network error" });
        } finally {
            setIsLoading(false);
        }
    }
    const handleSend = async () => {
        setChatLoading(true)
        try {
            const res = await fetch("http://localhost:3000/chatbot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: noteItem.note }),
            });
            if (!res.ok) {
                throw new Error("Failed to get chatbot response");
            }
            const data = await res.json();
            setNoteItem({ ...noteItem, content: data.response })
        } catch (err) {
            console.error("Chatbot Error:", err);
        } finally {
        }
        setChatLoading(false)
    };
    return (
        <div className='tab-con mynote'>
            <div className="edit-head">
                <button className='join' onClick={handleSend}>Ask ChatBot</button>
                <button className='join' onClick={handleSubmit}>Save Changes</button>
            </div>
            <div className="note-con mynote">
                <div className='con-item mynotes mynote'>
                    <input type="text" placeholder='Note..' autoFocus={true} value={noteItem.note} onChange={(e) => { setNoteItem({ ...noteItem, note: e.target.value }) }} />
                    <hr className='hrnotes' />
                    {chatLoading ? <div className={"chat-message mynote"}>
                        <div className="chatloader">
                            <div className="box-load1"></div>
                            <div className="box-load2"></div>
                            <div className="box-load3"></div>
                        </div>
                    </div> :
                        <textarea className='content-ta' name="" placeholder='content...' value={noteItem.content} onChange={(e) => { setNoteItem({ ...noteItem, content: e.target.value }) }} id=""></textarea>
                    }
                </div>
            </div>
        </div>
    )
}

export default MyNote