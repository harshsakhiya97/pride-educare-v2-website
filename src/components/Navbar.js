import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
// import jwtDecode from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout, decodedToken } = useContext(AuthContext);

  // const decodedToken = jwtDecode(token);

  // console.log("decodedToken", decodedToken?.name?.split(" ")[0]);
  const searchForCourse = () => {
    const searchValue = document.getElementById("navSearchValue").value;
    if (searchValue) {
      navigate(`/search-courses/${searchValue}`);
    } else {
      navigate("/courses");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container mt-1">
          <div className="col-sm-2 col-12">
            <a className="navbar-brand" href="/">
              <img src={require("../assets/logo.png")} alt="Logo" />
            </a>
          </div>

          <div className="col-sm-5 col-12">
            <form onSubmit={searchForCourse}>
              <div className="row">
                <div className="col-10">
                  <input
                    name="navSearchValue"
                    id="navSearchValue"
                    type="text"
                    className="search-bar"
                    placeholder="Search For Courses"
                  />
                </div>
                <div className="col-2">
                  <button type="submit" className="btn p-0 m-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M43.414 40.586L36.05 33.222C38.516 30.142 40 26.244 40 22C40 12.076 31.924 4 22 4C12.076 4 4 12.076 4 22C4 31.924 12.076 40 22 40C26.244 40 30.142 38.516 33.222 36.05L40.586 43.414L43.414 40.586ZM8 22C8 14.28 14.28 8 22 8C29.72 8 36 14.28 36 22C36 29.72 29.72 36 22 36C14.28 36 8 29.72 8 22Z"
                        fill="#1C3554"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="col-sm-1 col-4">
            <Link to="/courses" className="nav-link">
              Courses
            </Link>
          </div>

          {token ? (
            <>
              {/* <div className="col-1">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </div>
              <span className="col-1 my-auto">
                Hello, {decodedToken?.name?.split(" ")[0]}
              </span>
              <div className="col-1">
                <Link onClick={logout} className="btn-outline">
                  Logout
                </Link>
              </div> */}
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Profile />
            </>
          ) : (
            <>
              <div className="col-sm-1 col-4">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
              </div>

              <div className="col-sm-2 col-4">
                <Link to="/register" className="btn-blue">
                  Sign Up For Free
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
