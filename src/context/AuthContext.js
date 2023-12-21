import React, { createContext, useState } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

const tokenKey = "userToken";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(tokenKey) || "");

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem(tokenKey, newToken);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem(tokenKey);
  };

  const decodedToken = token && jwtDecode(token);

  // console.log("decodedToken", decodedToken);

  return (
    <AuthContext.Provider
      value={{
        token,
        updateToken,
        logout,
        decodedToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
