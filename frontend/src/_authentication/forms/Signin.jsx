import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../../assets/google.svg";
import { useSignin } from "../../hooks/useSignin";

const Signin = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { isLoading, error, signin } = useSignin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    const { email, password } = data;

    await signin(email, password);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="py-40 h-screen flex flex-1 justify-center items-center ">
      <form
        className="custom-form flex justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="form-title">Sign in</h1>
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
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format",
              },
            })}
          />
          <input
            className="custom-input"
            placeholder="Password"
            type="password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
          />
          {errors?.password?.message && (
            <p className="format-message error">{errors.root.message}</p>
          )}
          <p className="p-4 text-sm">
            Forgot your password?{" "}
            <Link to="/forgot-password" className="text-meta-5">
              Reset password
            </Link>
          </p>
          <button
            disabled={isSubmitting}
            type="submit"
            className="border border-blue-500 bg-graydark text-white rounded-lg py-2 w-1/2 "
          >
            {isSubmitting || isLoading ? "Signing in.." : "Sign in"}
          </button>
          {error && <span className="text-meta-1 text-sm">{error}</span>}

          <p className="p-4 mt-2">
            Don&apos;t have an Account?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signin;
