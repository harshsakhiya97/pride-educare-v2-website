import React, { createContext, useState } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
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
