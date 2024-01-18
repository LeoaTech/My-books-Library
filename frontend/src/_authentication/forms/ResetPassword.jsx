import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";
import { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "lenght must be atleast 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );
const ResetPassword = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();

  const { resetPassword, validateUser, message } = useResetPassword();

  useEffect(() => {
    validateUser(id, token);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isDirty, isValid, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: "all" });

  const onSubmit = async (data) => {
    console.log(data);
    const { password, confirmPassword } = data;

    console.log(data);
    await resetPassword(password, confirmPassword, id, token);
  };

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset();
  //   }
  // }, [isSubmitSuccessful, reset]);

  return (
    <div className="py-40 h-screen flex flex-1 justify-center items-center ">
      <div className="rounded-lg border border-stroke bg-white p-20 shadow-lg dark:border-strokedark dark:bg-boxdark">
        <form className="custom-form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="form-title">Create New Password</h1>
          <div className="custom-form">
            <input
              className="custom-input"
              placeholder="New Password"
              type="password"
              {...register("password")}
            />
            {errors?.password?.message && (
              <p className="format-message error">
                Password: {errors.password.message}
              </p>
            )}
            <input
              className="custom-input"
              placeholder="Confirm Password"
              type="password"
              {...register("confirmPassword")}
            />
            {errors?.confirmPassword?.message && (
              <p className="format-message error">
                Password: {errors.confirmPassword.message}
              </p>
            )}
            {errors?.root?.message && (
              <p className="format-message error">{errors.root.message}</p>
            )}
            {isSubmitSuccessful && message && (
              <p className="format-message success">
                Password Reset Successfully <Link to="/signin">Login Here</Link>
              </p>
            )}
            <button
              disabled={!isDirty || !isValid || isSubmitting}
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
                onClick={() => navigate("/")}
              >
                Home
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
