import React, { useEffect, useState } from 'react'
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';

export const Test = () => {
  const { testItem } = useStore();
  const [displayInstructions, setDisplayInstructions] = useState(true);
  const [displayTestDetails, setDisplayTestDetails] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    if (questions.length > 0) {
      setSelectedAnswers(new Array(questions.length).fill(-1));
    }
  }, [questions]);
  console.log(selectedAnswers)
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
  // useEffect(() => {
  //   if (testItem && testItem.test && !displayInstructions && !displayTestDetails) {
  //     const handleVisibilityChange = () => {
  //       if (document.hidden) {
  //         console.log("Tab is inactive");
  //       }
  //     };
  //     document.addEventListener("visibilitychange", handleVisibilityChange);
  //     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   }
  // }, [displayInstructions, displayTestDetails]);
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
      console.log(data);
      setQuestions(data);
    };
    testItem && fetchQuestions();
  }, []);

  useEffect(() => {
    console.log(testItem);
    if (testItem && !testItem.test) {
      setDisplayInstructions(false);
      setDisplayTestDetails(true);
    }
  }, [testItem]);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const handleBackButton = (event) => {
      event.preventDefault();
      const leave = window.confirm("Test is not submitted, You cannot reattempt the test.");
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
        !displayInstructions && !displayTestDetails && testItem.type === 'quiz' &&
        <div className="test-area quiz">
          <div className="time-rem">
            <p>Time Remaining: 30 minutes</p>
          </div>
          <div className="question-prog">
            Question 1 / {questions.length}
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
            {
              currentQuestion > 0 && <button className='join prev' onClick={() => { setCurrentQuestion(currentQuestion - 1) }}>Previous</button>
            }
            {
              currentQuestion < questions.length - 1 && <button className='join next' onClick={() => { setCurrentQuestion(currentQuestion + 1) }}>Next</button>
            }
          </div>
        </div>
      }
      {
        !displayInstructions && !displayTestDetails && testItem.type === 'task' &&
        <div className="test-area task">
          <div className="time-rem">
            <p>Time Remaining: 2 hours</p>
          </div>
          <div className="question-prog">
            Question 1 of {questions.length}
            <ProgressBar total={questions.length} current={currentQuestion + 1} />
          </div>
          <h2>Test Area</h2>
        </div>
      }
    </div >
  );
};
