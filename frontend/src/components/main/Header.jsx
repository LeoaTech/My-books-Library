import { useState, useEffect } from "react";
import { HiMenu, HiOutlineX, HiOutlineShoppingCart } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";



const Header = () => {

  // console.log(useParams());
  const { subdomain } = useParams();

  const { logout, signout } = useLogout();
  const { auth } = useAuthContext();


  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSticky, setStickyNav] = useState(false);
  const navigate = useNavigate();


  const onToggle = () => {
    setMenuOpen(!isMenuOpen);
  };
  // console.log(auth?.subdomain || subdomain);


  console.log(auth, "Current Auth");


  const handleSignout = () => {
    if (auth?.subdomain || subdomain) {
      signout();
      navigate(`/${auth?.subdomain || subdomain}`)
    }
  }
  const handleLogout = () => {
    if (auth?.subdomain || subdomain) {
      logout();
      navigate(`/${auth?.subdomain || subdomain}`)
    }
  }

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 150) {
        setStickyNav(true);
      } else {
        setStickyNav(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerLinks = [
    { title: "Library", path: "/library" },
    { title: "Shop", path: "/shop" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50">
      <nav
        className={`py-4 lg:px-24 px-4 transition-all duration-300 bg-[#776fff] 
        ${isSticky ? "bg-white/20 backdrop-blur-md shadow-md" : "bg-[#776fff]"}`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            onClick={() => isMenuOpen && onToggle()}
            to={`/${auth?.subdomain || subdomain}`}
            className="text-2xl font-bold text-white"
          >
            {auth?.entityName?.toUpperCase() || auth?.subdomain.toUpperCase() || subdomain.toUpperCase()} {" "}
            {/* <span className="bg-gradient-to-tr from-[#50142d] to-[#584ff7] bg-clip-text text-transparent">
              Library
            </span> */}
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8 text-white uppercase font-medium">
            {headerLinks.map(({ title, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="hover:text-purple-300 transition-colors"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4 text-white">
            <Link to="/cart">
              <HiOutlineShoppingCart className="h-5 w-5 hover:text-purple-300" />
            </Link>

            {!auth?.roleId && (
              <>
                <Link to={`/${auth?.subdomain || subdomain}/signin`} className="hover:text-purple-300">
                  Sign in
                </Link>
                <Link
                  to={`/${auth?.subdomain || subdomain}/signup`}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-400"
                >
                  Sign up
                </Link>
              </>
            )}

            {['owner'].includes(auth?.role_name) && (
              <Link to="/dashboard" className="hover:text-purple-300">
                {auth?.entityName?.toUpperCase()}
              </Link>
            )}
            {auth?.roleId && auth?.authSource == "email" && (
              <button onClick={handleLogout} className="hover:text-purple-300">
                Logout
              </button>
            )}
            {auth?.roleId && auth?.authSource == "google" && (
              <button onClick={handleSignout} className="hover:text-purple-300">
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={onToggle}
          >
            {isMenuOpen ? (
              <HiOutlineX className="h-6 w-6" />
            ) : (
              <HiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 px-4 py-6 bg-white/20 backdrop-blur-lg rounded-lg shadow-lg space-y-4 text-white">
            {headerLinks.map(({ title, path }) => (
              <Link
                key={path}
                to={path}
                onClick={onToggle}
                className="block uppercase text-base hover:text-purple-300"
              >
                {title}
              </Link>
            ))}

            <Link
              // to="/cart"
              onClick={onToggle}
              className="flex items-center gap-2 uppercase hover:text-purple-300"
            >
              <HiOutlineShoppingCart className="h-5 w-5" /> Cart
            </Link>

            {["customer"].includes(auth?.role_name) && (
              <Link
                // to="/dashboard"
                onClick={onToggle}
                className="block uppercase hover:text-purple-300"
              >
                {auth?.name?.toUpperCase() + " Dashboard"}
              </Link>
            )}

            {['owner'].includes(auth?.role_name) && (
              <Link to="/dashboard" className="hover:text-purple-300">
                {auth?.entityName?.toUpperCase()}
              </Link>
            )}

            {!auth?.roleId && (
              <>
                <Link
                  to={`/${auth?.subdomain || subdomain}/signin`}
                  onClick={onToggle}
                  className="block bg-transparent border border-white px-4 py-1 rounded-lg uppercase hover:bg-white hover:text-black"
                >
                  Sign in
                </Link>
                <Link
                  to={`/${auth?.subdomain || subdomain}/register`}
                  onClick={onToggle}
                  className="block bg-blue-500 px-4 py-1 rounded-lg uppercase text-white hover:bg-blue-400"
                >
                  Sign up
                </Link>
              </>
            )}

            {/* {auth?.roleId && (
              <button
                onClick={() => {
                  logout();
                  onToggle();
                }}
                className="block w-full bg-blue-500 px-4 py-1 rounded-lg uppercase text-white hover:bg-blue-400"
              >
                Sign Out
              </button>
            )} */}

            {auth?.roleId && auth?.authSource == "email" && (
              <button onClick={logout}
                className="block w-full bg-blue-500 px-4 py-1 rounded-lg uppercase text-white hover:bg-blue-400"
              >
                Logout
              </button>
            )}
            {auth?.roleId && auth?.authSource == "google" && (
              <button onClick={signout}
                className="block w-full bg-blue-500 px-4 py-1 rounded-lg uppercase text-white hover:bg-blue-400"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

