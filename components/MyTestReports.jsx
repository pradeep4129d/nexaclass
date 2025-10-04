import React, { useEffect } from 'react'
import useStore from '../store/store'

export const MyTestReports = () => {
  const { activityReports, setActivityReports } = useStore()
  useEffect(() => {
    const sortedReports = [...activityReports].sort((a, b) => b.id - a.id);
    setActivityReports(sortedReports)
  }, [])
  const testActivities = activityReports.filter(item => item.test);
  const generalActivities = activityReports.filter(item => !item.test);
  console.log(activityReports);
  return (
    <div className='tab-con mytests'>
      <h3>My Test Reports</h3>
      <div className="item-con a">
        {
          activityReports.length === 0 ?
            <div className="main-container">
              <p>Oop's! No</p>
              <div className="tooltip-container">
                <p> Reports to show!</p>
              </div>
            </div> :
            <>
              <div className="general-con mytests">
                <div className="general-head mytests">General Activities ({generalActivities.length})</div>
                {generalActivities.map((item, index) => (
                  <div className={'con-item mytests'} key={index}>
                    <div className='crcard mytests'>
                      <div className="icon">
                        <ion-icon name="reader-outline"></ion-icon>
                      </div>
                      <div className='info session mytests'>
                        <div>
                          <p className="item-text title">Activity:{item.activityId}</p>
                          <p className="item-text desc">Type:{item.type}</p>
                          <div className='other-details'>
                            <p className="item-text desc">Marks Scored:{item.marksScored}</p>
                          </div>
                        </div>
                          <div className={`tc-status ${(item.passed) ? "true" : "false"} mytests`}>{(item.passed) ? "Passed" : "Failed"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="general-con mytests">
                <div className="general-head mytests">Tests ({testActivities.length})</div>
                {testActivities.map((item, index) => (
                  <div className={'con-item mytests'} key={index}>
                    <div className='crcard mytests'>
                      <div className="icon">
                        <ion-icon name="newspaper-outline"></ion-icon>
                      </div>
                      <div className='info session mytests'>
                        <div>
                          <p className="item-text title">Activity:{item.activityId}</p>
                          <p className="item-text desc">Type:{item.type}</p>
                          <div className='other-details'>
                            <p className="item-text desc">Marks Scored:{item.marksScored}</p>
                          </div>
                        </div>
                        <div className={`tc-status ${(item.passed) ? "true" : "false"} mytests`}>{(item.passed) ? "Passed" : "Failed"}</div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </>
        }
      </div>
    </div>
  )
}
