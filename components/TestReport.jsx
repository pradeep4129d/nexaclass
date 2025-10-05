import React, { useEffect, useState } from 'react'
import useStore from '../store/store';

export const TestReport = () => {
  const { setIsLoading } = useStore()
  const [activityReports, setActivityReports] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/faculty/activityreports`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        });
        if (res.ok) {
          const response = await res.json();
          console.log(response)
          setActivityReports(response);
        }
      } catch (error) {
        setMessage({ color: "crimson", message: "network error" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])
  return (
    <div className='tab-con'>
      <h3>Test Reports</h3>
      <div className="item-con test-reports">
        {
          activityReports.length === 0 ?
            <div className="main-container">
              <p>Oop's! No</p>
              <div className="tooltip-container">
                <p> Notes to show!</p>
              </div>
            </div> :
            <div className="reports-con">
              {activityReports.map((report, index) => (
                <div className="report" key={index}>
                  <div className="report-data">
                    <p className="item-text title testreport">Student UserName:{report.studentUserName}</p>
                    <p className="item-text testreport">Session Title:{report.sessionTitle}</p>
                    <p className="item-text testreport">is Test:{report.test?"Yes":"No"}</p>
                    <p className="item-text testreport">Marks Scored:{report.marksScored}</p>
                    <p className="item-text testreport">Type:{report.type}</p>
                  </div>
                  <div className={`tc-status ${(report.passed) ? "true" : "false"} mytests`}>{(report.passed) ? "Passed" : "Failed"}</div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>

  )
}
