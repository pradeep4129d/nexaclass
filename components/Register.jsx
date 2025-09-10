import React, { useState ,useEffect} from 'react'
import useStore from '../store/store';

const Register = () => {
    const [verify,setVerify]=useState(false);
    const [sentOTP,setSentOTP]=useState(false);
    const [time,setTime]=useState({min:2,sec:0});
    const [otp,setOTP]=useState('');
    const [cp,setCp]=useState("");
    const {setIsLoading, setMessage,setLogin}=useStore();
    const [userDetails, setUserDetails]=useState({
        userName:"",
        email:"",
        password:"",
        role:"",
        semester:"",
        branch:"",
        section:""
    })
    function isBetween(ch) {
        return ch >= '1' && ch <= '8';
    }
    function isAlphabet(char) {
        return /^[A-Za-z]$/.test(char);
    }
    const handlechange=(e)=>{
        setUserDetails({...userDetails,[e.target.id]:e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(cp!==userDetails.password){
            setMessage({color:"crimson",message:"password mismatch"})
        }else if(userDetails.semester.length>1 || !isBetween(userDetails.semester)){
            setMessage({color:"crimson",message:"semester number must be 1-8"})
        }else if(userDetails.section.length>1 || !isAlphabet(userDetails.section)){
            setMessage({color:"crimson",message:"section must be an alphabet"})
        }else{
            setIsLoading(true);
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
            if(res.ok){
                setMessage({color:"green",message:"registered successfully"})
                const responce =await res.json();
                sessionStorage.setItem("token",responce.token)
                setLogin(true);
            }else{
                setMessage({color:"crimson",message:"error creating account"});
            }
        }
        setIsLoading(false)
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
        e.preventDefault();
        setIsLoading(true)
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
            setMessage({color:"green",message:"OTP verified"})
        }else{
            setMessage({color:"red",message:"Invalid OTP"})
        }
        setIsLoading(false);
    }
    const handleSentOTP=async(e)=>{
        e.preventDefault()
        if(!userDetails.email.length>=11 || userDetails.email.substring(10)!=="@sves.org.in"){
            setMessage({color:"red",message:"Enter Valid College Email"})
        }else{
            setIsLoading(true)
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
                setMessage({color:"green",message:"OTP sent Successfully"})
                setTime({ min: 2, sec: 0 });
                setSentOTP(true);
            }else{
                setMessage({color:"red",message:"email already in use"})
            }
            setIsLoading(false)
        }
    }
    return (
    <div className={`register `+userDetails.role}>
        <h2>Register</h2>
        {verify?<>
            <div className="details">
                <form onSubmit={handleSubmit}>
                    <input className='input_field' type="radio" name="student" id="role" value={"STUDENT"} onChange={handlechange} checked={userDetails.role==="STUDENT"} required={userDetails.role===""}/>Student 
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
                        <input type="number" name="semester" id="semester" placeholder='semester' onChange={handlechange} required/>
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