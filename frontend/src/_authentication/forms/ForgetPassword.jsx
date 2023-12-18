import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
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
        <h1 className="form-title">Forget Password</h1>
        <div className="custom-form">
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

          {errors?.root?.message && (
            <p className="format-message error">{errors.root.message}</p>
          )}
          {isSubmitSuccessful && (
            <p className="format-message success">Please check your Email</p>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className="border border-blue-500 bg-blue text-white rounded-md py-2 w-full "
          >
            Send Password Reset Email
          </button>
          <p className="p-4 mt-2">
            Back to Home Page{" "}
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

export default ForgetPassword;