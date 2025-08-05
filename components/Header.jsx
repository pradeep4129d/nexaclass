import React from 'react'

import {useNavigate,Link} from 'react-router-dom'
import useStore from '../store/store'
export const Header = () => {
    const {login,userData,setLogin}=useStore();
    return (
        <div className='header'>
            <div className="logo">
                <img src="https://res.cloudinary.com/dutz70yxy/image/upload/v1754044053/nexaclass-logo_fhljrp.jpg" alt="NexaClass" />
                <div className="logo-name">Nexa Class</div>
            </div>
            {!login ? <div className="contents">
                <div className="auth">
                    <a href="/login" className="login">Login</a>
                    <a href="/register" className="register"> Register</a>
                </div>
            </div>:<>
                <label className="event-wrapper">
                    <input type="checkbox"  className="event-wrapper-inp" />
                    <div className="bar">
                        <span className="top bar-list"></span>
                        <span className="middle bar-list"></span>
                        <span className="bottom bar-list"></span>
                    </div>
                    <section className="menu-container">
                        {(userData!=null && userData.role==="FACULTY")?<>
                        <div className="menu-list"><Link to="/">Class Rooms</Link></div>
                        <div className="menu-list"><Link to="/quizes">Quizes</Link></div>
                        <div className="menu-list"><Link to="/tasks">Tasks</Link></div>
                        <div className="menu-list"><Link to="/tests">Tests</Link></div>
                        </>:<>
                        </>
                        }
                        <div style={{color:"crimson"}} onClick={()=>{sessionStorage.removeItem("token");setLogin(false)}} className="menu-list">logout</div>
                    </section>
                </label>
            </>
            }
        </div>
    )
}
