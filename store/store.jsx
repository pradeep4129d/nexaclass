import { createContext, useContext, useState } from "react";

const ContextProvider = createContext();
export const Context = ({ children }) => {
const [login, setLogin] = useState(false);
const [userData, setUserData] = useState(null);
const [message, setMessage] = useState({color:'',message:''});
const [refresh, setRefresh] = useState(false);
const [isLoading,setIsLoading]=useState(false);
const [crItem,setCrItem]=useState(null);
const [sItem,setSItem]=useState(null);

    return (
        <ContextProvider.Provider value={{
        login,
        setLogin,
        userData,
        setUserData,
        message,
        setMessage,
        refresh,
        setRefresh,
        isLoading,
        setIsLoading,
        crItem,
        setCrItem,
        sItem,
        setSItem
        }}>{children}</ContextProvider.Provider>
    );
};
const useStore = () => {
return useContext(ContextProvider);
};
export default useStore;