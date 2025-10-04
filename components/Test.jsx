import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { CodeEditor } from './CodeEditor';
import { color } from 'framer-motion';


export const Test = () => {
  const { testItem, userData, setIsLoading, setMessage, setActivityReports, mySessionItem } = useStore();
  const updateCountdown = () => {
    const now = new Date();
    const start = new Date(mySessionItem.start);
    const end = new Date(mySessionItem.end);
    if (now < start) {
      const diff = start - now;
      setTimeLeft(`${formatTime(diff)}`);
    } else if (now >= start && now <= end) {
      const diff = end - now;
      setTimeLeft(`${formatTime(diff)}`);
    } else {
      setMessage({color:"crimson",message:"Time Ended"});
      (testItem.type === 'quiz') ? handleSubmit() : handleTaskSubmit();
    }
  };
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [mySessionItem]);
  const [displayInstructions, setDisplayInstructions] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [language, setLanguage] = useState([]);
  const [displayTestDetails, setDisplayTestDetails] = useState(false);
  const [defaultCode, setDefaultCode] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("java")
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [taskAnswers, setTaskAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ActivityReport, setActivityReport] = useState({
    facultyId: testItem.facultyId,
    sessionId: testItem.sessionId,
    type: testItem.type,
    activityId: testItem.id,
    test: testItem.test,
    studentId: userData.id,
    passed: false,
    marksScored: 0,
    taskAnswer: "",
    quizAnswers: ""
  })
  useEffect(() => {
    setDefaultCode(taskAnswers[currentQuestion]);
    setDefaultLanguage(language[currentQuestion]);
  }, [currentQuestion])
  const normalize = (s) =>
    s.replace(/^\n+/, "").replace(/\n+$/, "");
  const navigate = useNavigate()
  const handleTaskSubmit = async () => {
    setIsLoading(true)
    var marksScored = 0;
    var marksForEach = testItem.task.marks / questions.length;
    if (testItem.includeEditor) {
      for (let i = 0; i < questions.length; i++) {
        if (normalize(outputs[i]) === normalize(questions[i].answer))
          marksScored += marksForEach;
      }
    } else {
      const questionData = questions.map((q, index) => ({
        question: q.description,
        key: q.answer,
        studentAnswer: taskAnswers[index],
        maxMarks: marksForEach
      }));
      console.log("QuestionData sent:", questionData);
      try {
        const response = await fetch("http://localhost:3000/chatbot/evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questions: questionData }),
        });
        if (!response.ok) {
          throw new Error("Failed to evaluate answers");
        }
        const data = await response.json();
        console.log(data.totalMarks);
        marksScored += data.totalMarks;
      } catch (error) {
        console.error("Error evaluating answers:", error);
      }
    }
    const updatedReport = {
      ...ActivityReport,
      marksScored,
      taskAnswer: JSON.stringify(taskAnswers),
      passed: (marksScored / testItem.task.marks) * 100 >= 65
    };
    setActivityReport(updatedReport);
    console.log(updatedReport);
    const token = sessionStorage.getItem("token");
    const res = await fetch("http://localhost:3000/student/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedReport),
    });
    setIsLoading(false);
    if (res.ok) {
      const response = await res.json();
      setActivityReports(response);
      navigate("/mytests")
      setMessage({ color: "green", message: "submitted successfully" });
    }
  }
  const handleSubmit = async () => {
    setIsLoading(true)
    var marksScored = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === -1)
        continue;
      if (questions[i].questions.answer === selectedAnswers[i] + "") {
        marksScored += testItem.quiz.marksForCorrect
      } else
        marksScored -= testItem.quiz.negativeMarks
    }
    const updatedReport = {
      ...ActivityReport,
      marksScored,
      quizAnswers: JSON.stringify(selectedAnswers),
      passed: marksScored >= testItem.quiz.passingMarks
    };
    setActivityReport(updatedReport);
    console.log(updatedReport);
    const token = sessionStorage.getItem("token");
    const res = await fetch("http://localhost:3000/student/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedReport),
    });
    setIsLoading(false);
    if (res.ok) {
      const response = await res.json();
      setActivityReports(response);
      navigate("/mytests")
      setMessage({ color: "green", message: "submitted successfully" });
    }
  }
  useEffect(() => {
    if (testItem.type === 'quiz' && questions.length > 0) {
      setSelectedAnswers(new Array(questions.length).fill(-1));
    }
    if (testItem.type === 'task' && questions.length > 0) {
      setOutputs(new Array(questions.length).fill(""));
      setTaskAnswers(new Array(questions.length).fill(""));
      setLanguage(new Array(questions.length).fill("java"));
    }
  }, [questions]);
  useEffect(() => {
    if (testItem === null)
      navigate("/");
  }, [])
  const enableFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };
  useEffect(() => {
    if (testItem && testItem.test && !displayInstructions && !displayTestDetails) {
      const interval = setInterval(() => {
        if (!document.fullscreenElement) {
          console.log("User exited fullscreen! Submitting test...");
          (testItem.type === 'quiz') ? handleSubmit() : handleTaskSubmit();
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [testItem,displayInstructions, displayTestDetails]);
  useEffect(() => {
    if (testItem && testItem.test && !displayInstructions && !displayTestDetails) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
            (testItem.type === 'quiz') ? handleSubmit() : handleTaskSubmit();
            console.log("Tab is inactive");
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [displayInstructions, displayTestDetails]);
  useEffect(() => {
    if (testItem && testItem.test && !displayInstructions && !displayTestDetails) {
      const disableCopyPaste = e => e.preventDefault();
      document.addEventListener("copy", disableCopyPaste);
      document.addEventListener("paste", disableCopyPaste);
      document.addEventListener("cut", disableCopyPaste);
      document.addEventListener("contextmenu", disableCopyPaste);
      return () => {
        document.removeEventListener("copy", disableCopyPaste);
        document.removeEventListener("paste", disableCopyPaste);
        document.removeEventListener("cut", disableCopyPaste);
        document.removeEventListener("contextmenu", disableCopyPaste);
      };
    }
  }, [displayInstructions, displayTestDetails]);
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:3000/student/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: testItem.type,
          id: testItem.activityId
        }),
      });
      const data = await response.json();
      setQuestions(data);
    };
    testItem && fetchQuestions();
  }, []);
  useEffect(() => {
    if (testItem && !testItem.test) {
      setDisplayInstructions(false);
      setDisplayTestDetails(true);
    }
  }, [testItem]);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      (testItem.type === 'quiz') ? handleSubmit() : handleTaskSubmit();
      event.preventDefault();
      event.returnValue = "";
    };
    const handleBackButton = (event) => {
      event.preventDefault();
      (testItem.type === 'quiz') ? handleSubmit() : handleTaskSubmit();
      const leave = window.confirm("Test is will be submitted, You cannot reattempt the test.");
      if (!leave) {
        window.history.pushState(null, "", window.location.pathname);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBackButton);
    window.history.pushState(null, "", window.location.pathname);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);
  return (
    <div className='test-con'>
      {displayInstructions && <div className="instructions">
        <div className="head">
          <div className="test-logo">
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <h2>Test Instructions</h2>
        </div>
        <div className="inst-con">
          <div className="inst-item warn">
            <div className="inst-head">
              <ion-icon name="desktop-outline"></ion-icon>
              <p>DO NOT Exit Fullscreen</p>
            </div>
            <p>The test will automatically enter fullscreen mode. Exiting will be detected and logged as a violation</p>
          </div>
          <div className="inst-item warn">
            <div className="inst-head">
              <ion-icon name="eye-outline"></ion-icon>
              <p>DO NOT Switch Tabs or Windows</p>
            </div>
            <p>Any attempt to switch to another tab, window, or application will be detected and logged as a violation.</p>
          </div>
          <div className="inst-item warn">
            <div className="inst-head">
              <ion-icon name="keypad-outline"></ion-icon>
              <p>Disabled Keyboard Shortcuts</p>
            </div>
            <p>Copy (Ctrl+C), Paste (Ctrl+V), Developer Tools (F12), and other shortcuts are blocked.</p>
          </div>
        </div>
        <button className='join c' onClick={() => {
          setDisplayInstructions(false);
          setDisplayTestDetails(true);
        }}>Continue</button>
      </div>}
      {
        displayTestDetails && <div className="instructions">
          <div className="head">
            <div className="test-logo">
              <ion-icon name="newspaper-outline"></ion-icon>
            </div>
            <h2>Test Details</h2>
            <h3>Type:{testItem.type} </h3>
          </div>
          <div className="inst-con">
            <div className="inst-item warn">
              <div className="inst-head">
                <ion-icon name="checkbox-outline"></ion-icon>
                <p>Number of Questions {questions.length}</p>
              </div>
              <p>Read the Questions Carefully and Answer them to the best of your ability.</p>
            </div>
            {
              testItem.type === "quiz" && <>
                <div className="inst-item warn">
                  <div className="inst-head">
                    <ion-icon name="bar-chart-outline"></ion-icon>
                    <p>Maximum Marks:{questions.length * testItem.quiz.marksForCorrect}</p>
                  </div>
                  <p>+{testItem.quiz.marksForCorrect} For Every Correct Option</p>
                  <p>-{testItem.quiz.negativeMarks} For Every Incorrect Option</p>
                </div>
                <div className="inst-item warn">
                  <div className="inst-head">
                    <ion-icon name="medal-outline"></ion-icon>
                    <p>Passing Marks: {testItem.quiz.passingMarks}</p>
                  </div>
                  <p>Try to Score Atleast {testItem.quiz.passingMarks} to Pass</p>
                </div>
              </>
            }
            {
              testItem.type === "task" && <>
                <div className="inst-item warn">
                  <div className="inst-head">
                    <ion-icon name="eye-outline"></ion-icon>
                    <p>Maximum Marks: {questions.length * testItem.task.marks}</p>
                  </div>
                  <p>Read the Questions Carefully and Answer them to the best of your ability.</p>
                </div>
                <div className="inst-item warn">
                  <div className="inst-head">
                    <ion-icon name="keypad-outline"></ion-icon>
                    <p>Passing Score: 65%</p>
                  </div>
                  <p>Try to Score Atleast 65% to Pass</p>
                </div>
              </>
            }
            <button className='join c' onClick={() => {
              testItem.test && enableFullscreen();
              setDisplayTestDetails(false);
            }}>Start Test</button>
          </div>
        </div>
      }
      {
        !displayInstructions && !displayTestDetails && testItem.type === 'quiz' && questions.length > 0 &&
        <div className="test-area quiz">

          <div className="question-prog">
            <div className="q-info">
              <div>{currentQuestion + 1} / {questions.length}</div>
              <div>Time:{timeLeft}</div>
            </div>
            <ProgressBar total={questions.length} current={currentQuestion + 1} />
          </div>
          <div className="question-con">
            <div className="q">{questions[currentQuestion].questions.description}  </div>
            <div className="q-test-options-con">
              {
                questions[currentQuestion].options.map((option, index) => (
                  <div className="q-test-options" key={index}>
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={index}
                      checked={selectedAnswers[currentQuestion] === index}
                      onChange={() => {
                        setSelectedAnswers((prev) => {
                          const updated = [...prev];
                          updated[currentQuestion] = index;
                          return updated;
                        });
                      }}
                    /><p>{option.description}</p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="navbtns">
            <div>
              {
                currentQuestion > 0 && <button className='join prev' onClick={() => { setCurrentQuestion(currentQuestion - 1) }}>Previous</button>
              }
              {
                currentQuestion < questions.length - 1 && <button className='join next' onClick={() => { setCurrentQuestion(currentQuestion + 1) }}>Next</button>
              }
            </div>
            <button className='join prev' onClick={() => {
              alert("Are You Sure want to Submit test")
              handleSubmit()
            }}>Submit</button>
          </div>
        </div>
      }
      {
        !displayInstructions && !displayTestDetails && testItem.type === 'task' && questions.length > 0 &&
        <div className="test-area task">
          <div className="question-prog">
            <div className="q-info">
              <div>Question {currentQuestion + 1} / {questions.length}</div>
              <div>Time:{timeLeft}</div>
            </div>
            <ProgressBar total={questions.length} current={currentQuestion + 1} />
          </div>
          {questions.length >= 0 && <div className="question-con task">
            <div className="q task"><pre>{questions[currentQuestion].description}</pre></div>
            {testItem.includeEditor && <div className="q task"><div className="testcase">
              <p>Test Case:</p>
              <div className={`tc-status ${normalize(outputs[currentQuestion]) === normalize(questions[currentQuestion].answer) ? "true" : "false"}`}>{normalize(outputs[currentQuestion]) === normalize(questions[currentQuestion].answer) ? "Passed" : "Failed"}</div>
            </div><pre>{questions[currentQuestion].answer}</pre> </div>}
            <div className="answer">
              {testItem.includeEditor ?
                <CodeEditor test='test'
                  key={currentQuestion}
                  defaultLanguage={defaultLanguage}
                  defaultCode={defaultCode}
                  defaultOutput={outputs[currentQuestion]}
                  onCodeChange={(code) => setTaskAnswers((prev) => {
                    const updated = [...prev];
                    updated[currentQuestion] = code;
                    return updated;
                  })}
                  onOutputChange={(output) => setOutputs((prev) => {
                    const updated = [...prev];
                    updated[currentQuestion] = output;
                    return updated;
                  })}
                  onLanguageChange={(lan) => setLanguage((prev) => {
                    const updated = [...prev];
                    updated[currentQuestion] = lan;
                    return updated;
                  })}
                />
                :
                <div className="input-answer">
                  <textarea value={taskAnswers[currentQuestion]} onChange={(e) => {
                    setTaskAnswers((prev) => {
                      const updated = [...prev];
                      updated[currentQuestion] = e.target.value;
                      return updated;
                    })
                  }} autoFocus placeholder='Your Answer...'></textarea>
                </div>
              }
              <div className="navbtns test">
                <div>
                  {
                    currentQuestion > 0 && <button className='join prev' onClick={() => { setCurrentQuestion(currentQuestion - 1) }}>Previous</button>
                  }
                  {
                    currentQuestion < questions.length - 1 && <button className='join next' onClick={() => { setCurrentQuestion(currentQuestion + 1) }}>Next</button>
                  }
                </div>
                <button className='join prev' onClick={() => {
                  alert("Are You Sure want to Submit test")
                  handleTaskSubmit()
                }}>Submit</button>
              </div>
            </div>
          </div>}
        </div>
      }
    </div >
  );
};
