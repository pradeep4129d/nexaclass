import { createContext, useContext, useState } from "react";

const ContextProvider = createContext();
export const Context = ({ children }) => {
const [login, setLogin] = useState(false);
const [userData, setUserData] = useState(null);
const [message, setMessage] = useState({color:'',message:''});
const [refresh, setRefresh] = useState(false);
const [isLoading,setIsLoading]=useState(false);
const [crItem,setCrItem]=useState(null);
const [myCrItem,setMyCrItem]=useState(null);
const [sItem,setSItem]=useState(null);
const [quizItem,setQuizItem]=useState(null)
const [taskItem,setTaskItem]=useState(null);
const [mySessionItem,setMySessionItem]=useState(null);
const [testItem,setTestItem]=useState(null);
const [activityReports,setActivityReports]=useState([]);
const [isTest,setIsTest]=useState(false);
const [noteItem,setNoteItem]=useState(null)
    return (
        <ContextProvider.Provider value={{
        login,setLogin,
        userData,setUserData,
        message,setMessage,
        refresh,setRefresh,
        isLoading,setIsLoading,
        crItem,setCrItem,
        sItem,setSItem,
        quizItem,setQuizItem,
        taskItem,setTaskItem,
        myCrItem,setMyCrItem,
        mySessionItem,setMySessionItem,
        testItem,setTestItem,
        activityReports,setActivityReports,
        isTest,setIsTest,
        noteItem,setNoteItem,
        }}>{children}</ContextProvider.Provider>
    );
};
const useStore = () => {
return useContext(ContextProvider);
};
export default useStore;