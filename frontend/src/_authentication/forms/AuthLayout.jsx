import React from 'react'
import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isSignedin = false;
  return (
    <>
      {isSignedin ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className='flex flex-1 justify-center items-center flex-col '>
            <Outlet />
          </section>
          <img src="/assets/signin.jpg" alt="image" className='hidden lg:block h-screen w-1/2 cover bg-no-repeat' />
        </>
      )}

    </>
  )
}

export default AuthLayout