import { createContext, useState, useEffect } from "react";

export const AppContext= createContext(null);

const AppContextProvider = ({ children }) => {

    // const [User,SetUser] =useState(null);
    const [User, SetUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            SetUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (User) {
            localStorage.setItem('user', JSON.stringify(User));
        } else {
            localStorage.removeItem('user');
        }
    }, [User]); 
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('user');
    });

   
    const Detail={
        User,
        SetUser,
        isAuthenticated,
        setIsAuthenticated
    }

 return(
    <AppContext.Provider value={Detail}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;