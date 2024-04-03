import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useForgetPassword } from "../../hooks/useForgetPassword";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email(),
});
const ForgetPassword = () => {
  const navigate = useNavigate();
  const { forgetPassword, message, error } = useForgetPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    const { email } = data;
    await forgetPassword(email);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      // reset();
    }
  }, [isSubmitSuccessful]);
  return (
    <div className="py-40 h-screen flex flex-1 justify-center items-center ">
      <div className="rounded-lg border border-stroke bg-white p-20 shadow-lg dark:border-strokedark dark:bg-boxdark">
        <form className="custom-form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="form-title">Forget Password</h1>
          <div className="custom-form">
            <input
              className="custom-input"
              placeholder="Email"
              {...register("email")}
            />
            {errors?.email?.message && (
              <p className="format-message error">{errors.email.message}</p>
            )}

            {errors?.root?.message && (
              <p className="format-message error">{errors.root.message}</p>
            )}

            {isSubmitSuccessful && error && (
              <p className="text-meta-7">Please Enter a valid Email Address</p>
            )}
            {isSubmitSuccessful && message && (
              <p className="format-message success">
                Please check your Email to Reset Password
              </p>
            )}
            <button
              disabled={!isValid || !isDirty || isSubmitting}
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
    </div>
  );
};

export default ForgetPassword;
