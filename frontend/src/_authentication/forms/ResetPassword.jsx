import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
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
        <h1 className="form-title">Create New Password</h1>
        <div className="custom-form">
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
          <input
            className="custom-input"
            placeholder="Password2"
            type="password"
            {...register("password2")}
          />
          {errors?.user?.password2?.message && (
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
            onClick={() => console.log("Reset Password")}
            type="submit"
            className="border border-blue-500 bg-blue text-white rounded-lg py-2 w-full "
          >
            Reset Password
          </button>
          <p className="p-4 mt-2">
            Back to{" "}
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

export default ResetPassword;
