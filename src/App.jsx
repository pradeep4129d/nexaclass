import { useEffect, useState } from 'react'
import './App.css'
import useStore from '../store/store'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Login } from '../components/Login';
import Register from '../components/Register';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { Tasks } from '../components/Tasks';
import { Quiz } from '../components/Quiz';
import { Test } from '../components/Test';
import { ClassRoom } from '../components/ClassRoom';
import { ShowCR } from '../components/ShowCR';
import { ShowQuiz } from '../components/ShowQuiz';
import { ShowTask } from '../components/ShowTask';
import { Session } from '../components/Session';
import { Home } from '../components/Home';
import { MyCRs } from '../components/MyCRs';
import ShowMyCR from '../components/ShowMyCR';
import { MySession } from '../components/MySession';
import { CodeEditor } from '../components/CodeEditor';
import { TestReport } from '../components/TestReport';
import { MyTestReports } from '../components/MyTestReports';
import { MyNotes } from '../components/MyNotes';

function App() {
  const { login, isLoading, setLogin, setIsLoading, userData, setUserData, message, refresh, setActivityReports, setIsTest } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname !== "/test") {
      setIsTest(false);
    }
  }, [location.pathname])
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token != null && userData == null) {
      setIsLoading(true);
      const fetchdata = async () => {
        const res = await fetch("http://localhost:3000/auth/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token })
        })
        if (res.ok) {
          const responce = await res.json();
          console.log(responce);
          setUserData(responce);
          setLogin(true);
        } else {
          setLogin(false);
          sessionStorage.removeItem("token");
        }
        setIsLoading(false);
        navigate("/");
      }
      fetchdata();
    } else
      setLogin(false)
  }, [refresh])
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token != null && userData != null) {
      setIsLoading(true);
      const fetchData = async () => {
        const res = await fetch(`http://localhost:3000/student/attempted`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const response = await res.json();
          console.log(response)
          setActivityReports(response);
        }
      }
      fetchData()
      setIsLoading(false);
    }
  }, [userData])
  return (
    <>
      {isLoading && <Loading />}
      <Message />
      <Routes>
        {login ?
          <>
            {userData !== null && userData.role === "FACULTY" ?
              <><Route path='/' element={<ClassRoom />} />
                <Route path='/classroom' element={<ShowCR />} />
                <Route path='/tasks' element={<Tasks />} />
                <Route path='/quizes' element={<Quiz />} />
                <Route path='/testsreport' element={<TestReport />} />
                <Route path='/quiz' element={<ShowQuiz />} />
                <Route path='/task' element={<ShowTask />} />
                <Route path='/session' element={<Session />} />
              </> : <>
                <Route path='/' element={<Home />} />
                <Route path="/mycr" element={<MyCRs />}>
                  <Route path="cr" element={<ShowMyCR />}>
                    <Route path="session" element={<MySession />} />
                  </Route>
                </Route>
                <Route path='/test' element={<Test />} />
                <Route path='/editor' element={<CodeEditor
                  test=""
                  width="100%"
                  height="100%"
                  defaultLanguage="java"
                  onCodeChange={(code) => console.log("Current code:", code)}
                  onOutputChange={(output) => console.log("Code output:", output)}
                />} />
                <Route path='/mytests' element={<MyTestReports />} />
                <Route path='/mynotes' element={<MyNotes />} />
              </>
            }
          </> :
          <>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </>
        }
      </Routes>
    </>
  )
}

export default App
