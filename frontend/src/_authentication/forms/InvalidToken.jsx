import React from "react";
import { Link } from "react-router-dom";

const InvalidToken = () => {
  return (
    <div className="py-40 flex flex-col justify-center items-center">
      <p>
        {" "}
        Password Reset Link has expired. Please generate new Link to Reset
        Passowrd
      </p>


      <br/>

      <div className="text-blue">
        {" "}
        <Link to="/signin">Back to Sign in</Link>
      </div>
    </div>
  );
};

export default InvalidToken;
