import { createContext, useContext, useState } from "react";

const ContextProvider = createContext();
export const Context = ({ children }) => {
const [login, setLogin] = useState(false);
const [userData, setUserData] = useState(null);
const [message, setMessage] = useState(null);
const [refresh, setRefresh] = useState(false);
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
        }}>{children}</ContextProvider.Provider>
    );
};
const useStore = () => {
return useContext(ContextProvider);
};
export default useStore;