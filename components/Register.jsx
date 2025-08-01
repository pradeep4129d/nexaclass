import React, { useState ,useEffect} from 'react'

const Register = () => {
    const [verify,setVerify]=useState(false);
    const [sentOTP,setSentOTP]=useState(false);
    const [time,setTime]=useState({min:2,sec:0});
    const [otp,setOTP]=useState('');
    const [cp,setCp]=useState("");
    const [userDetails, setUserDetails]=useState({
        email:null,
        password:null,
        role:null,
        semester:null,
        branch:null,
        section:null
    })
    const handlechange=(e)=>{
        setUserDetails({...userDetails,[e.target.id]:e.target.value})
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(cp===userDetails.password){

        }else
            alert("password mismatch")
    }
    useEffect(() => {
    let interval = null;
    if (sentOTP) {
        interval = setInterval(() => {
        setTime(prevTime => {
            if (prevTime.sec > 0) {
            return { ...prevTime, sec: prevTime.sec - 1 };
            }
            if (prevTime.min > 0) {
            return { min: prevTime.min - 1, sec: 59 };
            }
            clearInterval(interval);
            return { min: 0, sec: 0 };
        });
        }, 1000);
    }

    return () => clearInterval(interval);
}, [sentOTP]);
    const handleVerify=(e)=>{
        e.preventDefault();
        setVerify(true);
    }
    const handleSentOTP=(e)=>{
        e.preventDefault()
        setSentOTP(true);
        setTime({ min: 2, sec: 0 });
    }
    return (
    <div className={`register `+userDetails.role}>
        <h2>Register</h2>
        {verify?<>
            <div className="details">
                <form onSubmit={handleSubmit}>
                    <input type="radio" name="student" id="role" value={"student"} onChange={handlechange} checked={userDetails.role==="student"} required={userDetails.role===null}/>Student 
                    <input type="radio" name='faculty' id='role' value={"faculty"} onChange={handlechange} checked={userDetails.role==="faculty"} required={userDetails.role===null}/>Faculty
                    {userDetails.role==="student" && <>
                        <input type="text" id='section' placeholder='Section' onChange={handlechange} required/>
                        <select id='branch' value={userDetails.branch} required onChange={handlechange} >
                            <option value="">-- Branch --</option>
                            <option value="CSE">CSE</option>
                            <option value="CST">CST</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                        </select>
                        <input type="number" name="year" id="semester" placeholder='semester' onChange={handlechange} required/>
                    </>}
                    <input type="password" name="password" id="password"  placeholder='password' onChange={handlechange} required/>
                    <input type="password" name="cpassword" id="cp" placeholder='conform password' onChange={(e)=>{setCp(e.target.value)}} required/><br/>
                    <button type='submit'>submit</button>
                </form>
            </div>
        </>:<>
            {!sentOTP?<form onSubmit={handleSentOTP} className="verify">
                <input type="text"  placeholder='Email' required onChange={(e)=>{
                    setUserDetails({...userDetails,email:e.target.value})
                }}/>
                <ion-icon name="mail"></ion-icon>
                <button type='submit'>send OTP</button>
            </form>:
            <form onSubmit={handleVerify} className="verify">
                <input type="text" id='otp' value={otp} onChange={(e)=>{setOTP(e.target.value)}} required placeholder='XXXX'/>
                <div className="time">{sentOTP && time.min!=0 || time.sec!=0?<>0{time.min}:{time.sec}</>:<><a onClick={()=>{setSentOTP(false)}} href="">resend OTP</a></>}</div>
                <button type='submit'>verify OTP</button>
            </form>}
        </>}
        
    </div>
)
}

export default Register