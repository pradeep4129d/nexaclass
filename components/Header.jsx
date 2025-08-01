import React from 'react'

import {useNavigate} from 'react-router-dom'
import useStore from '../store/store'
export const Header = () => {
    const {login}=useStore();
    return (
        <div className='header'>
            <div className="logo">
                <img src="https://res.cloudinary.com/dutz70yxy/image/upload/v1754044053/nexaclass-logo_fhljrp.jpg" alt="NexaClass" />
                <div className="logo-name">Nexa Class</div>
            </div>
            {!login && <div className="contents">
                <div className="auth">
                    <a href="/login" className="login">Login</a>
                    <a href="/register" className="register"> Register</a>
                </div>
            </div>
            }
        </div>
    )
}
