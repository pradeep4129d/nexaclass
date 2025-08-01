import React from 'react'

export const Login = () => {
  const handleSubmit=(e)=>{
  }
  return (
    <div className='logincard'>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="email">
          <input type="text" name='email' id='u' placeholder='Email'/>
          <ion-icon name="mail"></ion-icon>
        </div>
        <div className="password">
          <input type="password" name="password" id="p" placeholder='password'/>
          <ion-icon name="key"></ion-icon>
        </div>
        <button type='submit' id='l-sub'>Submit</button>
      </form>
    </div>
  )
}
