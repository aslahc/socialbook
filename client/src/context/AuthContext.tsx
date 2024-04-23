// import React, { createContext, useContext, useState, ReactNode } from "react";

// // Define types for your context value
// interface AuthContextType {
//   authUser: string | null;
//   setAuthUser: React.Dispatch<React.SetStateAction<string | null>>;
// }

// // Define props type for AuthContextProvider
// interface AuthContextProviderProps {
//   children: ReactNode;
// }

// // Create your context
// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Create a custom hook to use the context
// export const useAuthContext = () => {
//   console.log("entering to useAuthcontext")
//   const context = useContext(AuthContext)!;
//   return context;
// }

// // Create your context provider component
// export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
//   console.log("local stooorage")
//   const storedUser = localStorage.getItem("chat-user");
//   console.log("AA",storedUser)
//   const [authUser, setAuthUser] = useState<string | null>(
//     storedUser ? JSON.parse(storedUser) : null
//   );
  
//   return (
//     <AuthContext.Provider value={{ authUser, setAuthUser }}>
     
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React from 'react'

function AuthContext() {
  return (
    <div>AuthContext</div>
  )
}

export default AuthContext