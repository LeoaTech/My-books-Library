// Example in a React component
import { Link, useLocation } from "react-router-dom";

function AuthFailurePage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const errorMessage = query.get("error") || "Authentication failed";

  return (
    <div>
      <h1>Authentication Failed</h1>
      <p>{errorMessage}</p>
      <Link to="/signin">Try again</Link>
    </div>
  );
}

export default AuthFailurePage;