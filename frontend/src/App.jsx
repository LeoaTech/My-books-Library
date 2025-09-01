import Home from "./_root/pages/Home";
import "./App.css";
import { ToastContainer } from 'react-toastify';

import Navbar from "./components/_user/Navbar/Navbar";
import {  useNavigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect } from "react";
function App() {
  const { auth, googleAuth, getUser } = useAuthContext();
  const navigate = useNavigate();
  

  // console.log(googleAuth," Source of Auth");


  useEffect(() => {
    const handleAuth = async () => {
      const redirectUrl = await getUser();
      navigate(redirectUrl, { replace: true });
    };

    if (googleAuth != "email") {
      handleAuth();
    // } else {
    //   console.log("No need to fetch google auth result");

    }
  }, [getUser, navigate, googleAuth]);


  console.log("Auth in main app", auth);
  return (
    <>
      <Navbar />
      {/* <Home /> */}
      <h2 className="mt-20 flex justify-center items-center">Landing Page</h2>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
    </>
  )
}


export default App;
