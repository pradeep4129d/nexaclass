import { useScroll } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import useStore from '../store/store';

export const Utility = () => {
    const { setIsLoading, setMessage, isTest, login,userData } = useStore();
    const chatBodyRef = useRef(null);
    const [hide, setHide] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [disableChat, setDisableChat] = useState(false);
    const [messages, setMessages] = useState([])
    const [query, setQuery] = useState("");
    const [disableInput, setDisableInput] = useState(false);
    const [chatLoading, setChatLoading] = useState(false)
    const [note, setNote] = useState({
            studentId: userData && userData.id||-1,
            note: "",
            content: ""
    })
    const handleSubmit = async () => {
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
                setMessage({ color: "green", message: "Note Created Successfully." })
                setNote({ studentId: userData.id, note: "", content: "" })
                setShowNotes(false);
            }
        } catch (error) {
            setMessage({ color: "crimson", message: "network error" });
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSend = async () => {
        setChatLoading(true)
        if (!query.trim()) return;
        setDisableInput(true);
        const userMsg = { content: query.trim(), user: true };
        setMessages((prev) => [...prev, userMsg]);
        const userQuery = query.trim();
        setQuery("");
        try {
            const res = await fetch("http://localhost:3000/chatbot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: userQuery }),
            });
            if (!res.ok) {
                throw new Error("Failed to get chatbot response");
            }
            const data = await res.json();
            const botMsg = { content: data.response || "No response from chatbot.", user: false };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error("Chatbot Error:", err);
            setMessages((prev) => [
                ...prev,
                { content: "⚠️ Sorry, something went wrong. Please try again.", user: false },
            ]);
        } finally {
            setDisableInput(false);
        }
        setChatLoading(false)
    };
    
    useEffect(() => {
        console.log(isTest);
        isTest ? setDisableChat(true) : setDisableChat(false)
    }, [isTest])
    return (
        <div className={'utility-con ' + (hide ? "hide" : "view") + " " + (login && userData && userData.role==="STUDENT" ? "" : "disable")}>
            <div className="action-wrap">
                {!disableChat && <button className="action" type="button" onClick={() => { setShowChat(showChat?false:true); setShowNotes(false) }}>
                    <ion-icon name="chatbox-ellipses-outline"></ion-icon>
                </button>}
                <button className="action" type="button" onClick={() => { setShowNotes(showNotes?false:true); setShowChat(false) }}>
                    <ion-icon name="clipboard-outline"></ion-icon>
                </button>
                <div className="backdrop"></div>
            </div>
            {!hide ? <div className="hide" onClick={() => { setHide(true) }}>
                <ion-icon name="chevron-back-outline"></ion-icon>
            </div> :
                <div className="hide" onClick={() => { setHide(false) }}>
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                </div>}
            {
                showChat && <div className='chatbot-con'>
                    <div className="chatbot-head">
                        <div className="chat-logo">
                            <ion-icon name="chatbox-ellipses-outline"></ion-icon>
                            <h4>ChatBot Assistance</h4>
                        </div>
                        <div className="close" onClick={() => { setShowChat(false) }}><ion-icon name="close-outline"></ion-icon></div>
                    </div>
                    <div className="chatbot-body" ref={chatBodyRef}>
                        {
                            messages.map((message, index) => (
                                <div className={"chat-message"} key={index}>
                                    <div className={"m " + (message.user ? "user" : "bot")}>
                                        <pre>{message.content}</pre>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            chatLoading && <div className={"chat-message"}>
                                <div className="chatloader">
                                    <div className="box-load1"></div>
                                    <div className="box-load2"></div>
                                    <div className="box-load3"></div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="chatbot-chat">
                        <input type="text" placeholder='Ask Anything...' readOnly={disableInput} value={query} onChange={(e) => { setQuery(e.target.value) }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                    handleSend();
                            }}
                        />
                        <div className="send-btn" onClick={() => { !disableInput && handleSend() }}><ion-icon name="send-outline"></ion-icon></div>
                    </div>
                </div>
            }
            {
                showNotes && <div className="show-notes">
                    <div className="create-note">
                        <input type="text" placeholder='Enter Your Note..' value={note.note} onChange={(e)=>{setNote({...note,note:e.target.value})}}/>
                        <button className='join' onClick={handleSubmit}>Create</button>
                    </div>
                </div>
            }
        </div>
    )
}
