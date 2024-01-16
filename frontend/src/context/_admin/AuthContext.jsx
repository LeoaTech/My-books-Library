import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

console.log(AuthContext);
export const authReducer = (state, action) => {
  switch (action.type) {
    case "Login":
      return { user: action.payload };
    case "Logout":
      return { user: null };
    default:
      return state;
  }
};
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "Login", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
