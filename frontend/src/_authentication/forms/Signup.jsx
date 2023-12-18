import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/google.svg";

const Signup = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    isSubmitSuccessful,
    isSubmitting,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="py-40 h-screen flex flex-1 justify-center items-center ">
      <form className="custom-form" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="form-title">Create account</h1>
        <div className="custom-form">
          <a
            className="google-oauth-button"
            href={`/auth/google/start${search}`}
          >
            <img src={GoogleIcon} width={22} height={22} /> Continue with Google
          </a>
          <input
            className="custom-input"
            placeholder="Email"
            {...register("email")}
          />
          {errors?.user?.email?.message && (
            <p className="format-message error">
              Email: {errors.user.email.message}
            </p>
          )}
          <input
            className="custom-input"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors?.user?.password?.message && (
            <p className="format-message error">
              Password: {errors.user.password.message}
            </p>
          )}
          {errors?.root?.message && (
            <p className="format-message error">{errors.root.message}</p>
          )}
          {isSubmitSuccessful && (
            <p className="format-message success">Please check your inbox</p>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className="border border-blue-500 bg-graydark text-white rounded-lg py-2 w-1/2 "
          >
            Sign up
          </button>
          <p className="p-4 mt-2">
            Already have an Account?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
