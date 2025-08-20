import { Link } from "react-router-dom";
import GoogleIcon from "../../assets/google.svg";
const serverUrl = import.meta.env.VITE_SERVER_ENDPOINT;

const GoogleAuthLink = ({ action, subdomain }) => {
  const origin = window.location.origin; 

  //  the query string
  const queryParams = new URLSearchParams();
  // added these action 'create_lib' or 'join_lib'
  queryParams.append('action', action); 
  queryParams.append('origin', origin); // Add the current domain
  // Join Library (sign up) or sign in to a Library domain
  if (action === 'join_lib' && subdomain) {
    queryParams.append('subdomain', subdomain); 
  }
  const authUrl = `${serverUrl}/auth/google?${queryParams.toString()}`;

  return (
    <Link className="google-oauth-button" to={authUrl}>
      <img src={GoogleIcon} width={22} height={22} alt="Google Icon" /> Continue with Google
    </Link>
  );
};

export default GoogleAuthLink;