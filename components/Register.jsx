import React, { useState ,useEffect} from 'react'

const Register = () => {
    const [verify,setVerify]=useState(false);
    const [sentOTP,setSentOTP]=useState(false);
    const [time,setTime]=useState({min:2,sec:0});
    const [otp,setOTP]=useState('');
    const [cp,setCp]=useState("");
    const [userDetails, setUserDetails]=useState({
        userName:"",
        email:"",
        password:"",
        role:"",
        semester:"",
        branch:"",
        section:""
    })
    const handlechange=(e)=>{
        setUserDetails({...userDetails,[e.target.id]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(cp===userDetails.password){

            console.log(userDetails);
            const res= await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName:userDetails.email.substring(0,9),
                email:userDetails.email,
                password:userDetails.password,
                role:userDetails.role,
                semester:userDetails.semester,
                branch:userDetails.branch,
                section:userDetails.section
            }),
        })
        console.log(res.body);
        if(res.ok){
            alert("register successfull");
        }
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
    const handleVerify=async(e)=>{
        console.log(userDetails.email);
        e.preventDefault();
        const res= await fetch("http://localhost:3000/auth/verifyotp", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email:userDetails.email,
                otp:otp
            }),
        })
        if(res.ok){
            setVerify(true);
        }

    }
    const handleSentOTP=async(e)=>{
        e.preventDefault()
        
        setTime({ min: 2, sec: 0 });
        const res=await fetch("http://localhost:3000/auth/sendotp", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email:userDetails.email
            }),
        })
        if(res.ok){
            setSentOTP(true);
        }
    }
    return (
    <div className={`register `+userDetails.role}>
        <h2>Register</h2>
        {verify?<>
            <div className="details">
                <form onSubmit={handleSubmit}>
                    <input type="radio" name="student" id="role" value={"STUDENT"} onChange={handlechange} checked={userDetails.role==="STUDENT"} required={userDetails.role===""}/>Student 
                    <input type="radio" name='faculty' id='role' value={"FACULTY"} onChange={handlechange} checked={userDetails.role==="FACULTY"} required={userDetails.role===""}/>Faculty
                    {userDetails.role==="STUDENT" && <>
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
                <input type="text" id='otp' value={otp} onChange={(e)=>{setOTP(e.target.value)}} required placeholder='XXXXXX'/>
                <div className="time">{sentOTP && time.min!=0 || time.sec!=0?<>0{time.min}:{time.sec}</>:<><a onClick={()=>{setSentOTP(false)}} href="">resend OTP</a></>}</div>
                <button type='submit'>verify OTP</button>
            </form>}
        </>}
        
    </div>
)
}

export default Register