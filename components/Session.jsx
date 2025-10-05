import React, { useEffect, useState } from 'react'
import useStore from '../store/store';

export const Session = () => {
  const { userData, setIsLoading, setMessage, sItem } = useStore();
  const [displayForm, setDisplayForm] = useState(false);
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([])
  const [showProps, setShowProps] = useState(false)
  const [index, setIndex] = useState(0);
  const [quizName, setQuizName] = useState("")
  const [activity, setActivity] = useState({
    facultyId: userData.id,
    sessionId: sItem.id,
    type: "",
    activityId: null,
    test: false,
    includeEditor: false
  })
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token !== null) {
      setIsLoading(true);
      const fetchData = async () => {
        const res = await fetch(`http://localhost:3000/faculty/activity/${sItem.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const response = await res.json();
          setActivities(response);
        } else
          setMessage({ color: "crimson", message: "Network error" });
      }
      fetchData();
      setIsLoading(false)
    }
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3000/faculty/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activity),
      });
      if (res.ok) {
        const response = await res.json();
        console.log(response)
        setActivities(response);
        setActivity({
          facultyId: userData.id,
          sessionId: sItem.id,
          type: "",
          activityId: null,
          test: false,
          includeEditor: false
        })
        setDisplayForm(false);
        setMessage({ color: "green", message: "created successfully" });
      } else
        setMessage({ color: "crimson", message: "error creating" });
    } catch (error) {
      setMessage({ color: "crimson", message: "network error" });
    } finally {
      setIsLoading(false);
    }
  }
  const fetchActivities = async () => {
    const token = sessionStorage.getItem("token");
    setIsLoading(true);
    if (activity.type === "quiz") {
      const res = await fetch("http://localhost:3000/faculty/quiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const response = await res.json();
        setAllActivities(response);
      } else
        setMessage({ color: "crimson", message: "Network error" });
    } else if (activity.type === "task") {
      const res = await fetch("http://localhost:3000/faculty/task", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const response = await res.json();
        setAllActivities(response);
      } else
        setMessage({ color: "crimson", message: "Network error" });
    }
    setIsLoading(false);
  }
  const handlechange = (e) => {
    setActivity({ ...activity, [e.target.name]: e.target.value })
  }
  const handleDelete = async (id) => {
    setIsLoading(true)
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/faculty/activity/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.ok) {
        const response = await res.json();
        setActivities(response);
        setMessage({ color: "green", message: "Deleted successfully" });
      } else
        setMessage({ color: "crimson", message: "error deleting" });
    } catch (error) {
      setMessage({ color: "crimson", message: "network error" });
    } finally {
      setIsLoading(false);
    }
  }
  const fetchName = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/faculty/quiz/${activities[index].activityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const response = await res.json();
      setQuizName(response.title);
    }
    setIsLoading(false);
  }
  console.log(activity)
  return (
    <div className='activity'>
      {
        showProps && <div className="showprops">
          <div className="cancel-form" onClick={() => { setShowProps(false) }}>x</div>
          <div className="activity-props-con">
            <p>Selected Activity:{quizName}</p>
            <p>is Test:{activities[index].test ? "Yes" : "No"}</p>
            <p>include Code Editor:{activities[index].includeEditor ? "Yes" : "No"}</p>
          </div>
        </div>
      }
      <button className="newcr" onClick={() => { setDisplayForm(true) }}>New</button>
      {displayForm && <div className="CRForm">
        <div className="popup">
          <div className="cancel-form" onClick={() => { setDisplayForm(false) }}>x</div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="icon">
              <ion-icon name="document-text-outline"></ion-icon>
            </div>
            <div className="note">
              <label className="title">Set up properties</label>
              <span className="subtitle">Activity properties cannot be updatable onces created.</span>
            </div>
            <select id='cb' onClick={fetchActivities} value={activity.type} name='type' required onChange={handlechange} className="input_field">
              <option value="">-- Activity Type --</option>
              <option value="quiz">Quiz</option>
              <option value="task">Task</option>
            </select>
            <select id='cb' name='activityId' required onChange={handlechange} className="input_field">
              <option value="">-- choose {activity.type} --</option>
              {
                allActivities.map((a, index) => (
                  <option value={a.id}>{a.title}</option>
                ))
              }
            </select>
            <div className="checks">
              <label htmlFor="test">Mark as test:</label>
              <input onChange={handlechange} value={JSON.parse(activity.test) ? false : true} id='check' name="test" type="checkbox" className="input_field" />
            </div>
            <div className="checks">
              <label htmlFor="includeEditor">Include Code Editor:</label>
              <input onChange={handlechange} value={JSON.parse(activity.includeEditor) ? false : true} id='check' name="includeEditor" type="checkbox" className="input_field" />
            </div>
            <button className="submit" type='submit'>Create</button>
          </form>
        </div>
      </div>}
      {
        activities.length === 0 ? <>
          <div className="main-container">
            <p>Oop's! No</p>
            <div className="tooltip-container">
              <span className="tooltip">Create</span>
              <div className="text" onClick={() => { setDisplayForm(true) }}>activities</div>
              <p>to show!</p>
            </div>
          </div>
        </> : <>
          <div className="activity-con">
            {activities.map((a, index) => (
              <div className='item' key={index} >
                <div className='crcard'>
                  <div className="icon">
                    <ion-icon name="reader-outline"></ion-icon>
                  </div>
                  <div className='info session' onClick={() => {

                  }}>
                    <p className="item-text title">Activity:{a.id}</p>
                    <p className="item-text">Type:{a.type}</p>
                    <a id='sp' onClick={() => { setShowProps(true); setIndex(index); fetchName() }}>show properties</a>
                  </div>
                </div>
                <button onClick={() => { handleDelete(a.id) }} aria-label="Delete item" className="delete-button">
                  <svg
                    class="trash-svg"
                    viewBox="0 -10 64 74"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="trash-can">
                      <rect
                        x="16"
                        y="24"
                        width="32"
                        height="30"
                        rx="3"
                        ry="3"
                        fill="#e74c3c"
                      ></rect>

                      <g transform-origin="12 18" id="lid-group">
                        <rect
                          x="12"
                          y="12"
                          width="40"
                          height="6"
                          rx="2"
                          ry="2"
                          fill="#c0392b"
                        ></rect>
                        <rect
                          x="26"
                          y="8"
                          width="12"
                          height="4"
                          rx="2"
                          ry="2"
                          fill="#c0392b"
                        ></rect>
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      }
    </div>
  )
}
