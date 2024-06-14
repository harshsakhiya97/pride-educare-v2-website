import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../helper/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [currentStep, setCurrentStep] = useState("login");
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [number, setNumber] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [registrationError, setRegistrationError] = useState(null);

  const navigate = useNavigate();

  const { updateToken } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setStudentDetails({ ...studentDetails, [name]: value });
  };

  const [studentDetails, setStudentDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("submit", number);

    try {
      const response = await axios.post("/student/register", studentDetails);
      const data = response.data;

      if (data.status === "OK" && data.code === "200") {
        // console.log("Registration successful:", data.message);

        setStudentDetails({
          firstName: "",
          lastName: "",
          email: "",
          phone: number,
          dob: "",
        });

        sendRegPhoneNumber();
      } else {
        // console.log(data.message, "msg");
        setRegistrationError(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response.data.errorMsg.errorMessage) {
        alert(error.response.data.errorMsg.errorMessage);
      }
    }
  };

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
  };

  const sendRegPhoneNumber = async () => {
    // e.preventDefault();

    try {
      const response = await axios.post("auth/send-login-otp", {
        username: number,
      });

      const data = response.data;
      // console.log(data.data, "data");

      if (data.status === "OK" && data.code === "200") {
        // console.log("Your OTP is : ", data.data.otp);
        setOtp(data.data.otp);
        setSentOtp(true);
        setCurrentStep("otp");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data.errorMsg.errorMessage === "User not found!"
      ) {
        setCurrentStep("registration");
        setStudentDetails({
          ...studentDetails,
          phone: number,
        });
      }

      // console.error("Network error", error.response);
    }
  };

  const sendPhoneNumber = async (e) => {
    e.preventDefault();

    setLoginErrorMessage("")

    if (!number) {
      alert("Please enter a number");
    } else if (number.length != 10) {
      alert("Please enter a valid number");
    } else {
      try {
        const response = await axios.post("auth/send-login-otp", {
          username: number,
        });

        const data = response.data;
        // console.log(data.data, "data");

        if (data.status === "OK" && data.code === "200") {
          // console.log("Your OTP is : ", data.data.otp);
          setOtp(data.data.otp);
          setSentOtp(true);
          setCurrentStep("otp");
        }
      } catch (error) {

        if ( error.response ) {

          if(error.response.status == 400) { // registration

            setCurrentStep("registration");
            setStudentDetails({
              ...studentDetails,
              phone: number,
            });
  
          } else if(error.response.status == 417) { // dob not found

            setLoginErrorMessage(error.response.data.data.message);

          }

        }

        // console.error("Network error", error.response);
      }
    }
  };

  const handleOtpChange = (e) => {
    setUserOtp(e.target.value);
  };

  const verifyOTPAndLogin = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please Enter your OTP");
      return;
    }

    if (otp === userOtp) {
      try {
        const response = await axios.post("auth/generate-token-app", {
          username: number,
          otp: userOtp,
        });

        const data = response.data;

        if (data.status === "OK" && data.code === "200") {
          updateToken(data.data.accessToken);
          navigate("/dashboard");
        } else {
          setOtpError(true);
          console.error("OTP verification failed");
        }
      } catch (error) {
        console.error("Network error", error);
      }
    } else {
      setOtpError(true);
    }
  };

  return (
    <>
      <section className="login-form-section position-relative">
        <img
          src={require("../assets/login-img.png")}
          className="img-responsive login-img"
          draggable="false"
        />
        <div className="login-form">
          <h3>Welcome to India's first virtual classroom...!</h3>
          <p className="mb-4">
            Only app in India for learning, certification & finding right
            Job...!
          </p>

          {currentStep === "login" && (
            <div className="login-input text-center d-flex justify-content-center align-items-center">
              <form onSubmit={sendPhoneNumber}>
                <input
                  type="tel"
                  name="number"
                  maxLength={10}
                  style={{ width: "100%" }}
                  onChange={handleNumberChange}
                  placeholder="Phone Number"
                />
                <span className="d-block mt-3">
                  By providing my number, I hereby agree and accept the{" "}
                  <a href="/">Terms & Conditions</a> and{" "}
                  <a href="/">Privacy Policy</a> in use of the Pride Educare App
                </span>
                {
                  loginErrorMessage && 
                  <>
                  <span className="error">
                    {loginErrorMessage}
                  </span><br />  
                  </>
                }
                <button className="btn btn-primary mt-3" type="submit">
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="30"
                    viewBox="0 0 35 30"
                    fill="none"
                  >
                    <path
                      d="M6.67453e-05 29.698L34.6473 14.8478L6.67453e-05 0C6.67453e-05 0 0.276248 10.5706 2.03598 11.6998C3.79572 12.829 24.7403 14.5288 24.7488 14.8478C24.7403 15.2144 4.11712 16.511 2.03721 17.7685C-0.0427046 19.0259 6.67453e-05 29.698 6.67453e-05 29.698Z"
                      fill="#466EB6"
                    />
                  </svg> */}
                  Submit
                </button>
              </form>
            </div>
          )}
          {currentStep === "otp" && (
            <div className="otp-form text-center d-flex flex-column justify-content-evenly align-items-center">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="161"
                  height="161"
                  viewBox="0 0 161 161"
                  fill="none"
                >
                  <path
                    d="M80.5 161C124.959 161 161 124.959 161 80.5C161 36.0411 124.959 0 80.5 0C36.0411 0 0 36.0411 0 80.5C0 124.959 36.0411 161 80.5 161Z"
                    fill="#6487C9"
                  />
                  <path
                    d="M91.8312 160.203C123.409 155.754 149.1 132.988 157.813 102.993L113.807 58.9879L98.2869 60.1951L79.4043 41.3125L71.8282 47.2522L70.8345 48.6075L57.5404 61.2149L81.1222 84.7967L35.7793 104.151L91.8312 160.203Z"
                    fill="#466EB6"
                  />
                  <path
                    d="M35.7793 104.151C35.7793 85.9682 50.5193 71.2285 68.7013 71.2285C86.8833 71.2285 101.623 85.9685 101.623 104.151H35.7793Z"
                    fill="white"
                  />
                  <path
                    d="M69.2303 66.9299C77.4207 66.9299 84.0602 60.2903 84.0602 52.0999C84.0602 43.9096 77.4207 37.27 69.2303 37.27C61.04 37.27 54.4004 43.9096 54.4004 52.0999C54.4004 60.2903 61.04 66.9299 69.2303 66.9299Z"
                    fill="white"
                  />
                  <path
                    d="M119.057 95.751H114.178V70.4215C114.178 64.7834 109.591 60.1961 103.954 60.1961C98.3156 60.1961 93.7283 64.7834 93.7283 70.4215V95.751H88.8496V70.4215C88.8496 62.0929 95.6251 55.3174 103.954 55.3174C112.282 55.3174 119.057 62.0929 119.057 70.4215V95.751Z"
                    fill="#F5F5F5"
                  />
                  <path
                    d="M121.802 116.987H86.1008C83.9839 116.987 82.2676 115.27 82.2676 113.154V84.6799C82.2676 82.563 83.9839 80.8467 86.1008 80.8467H121.802C123.919 80.8467 125.635 82.563 125.635 84.6799V113.154C125.635 115.27 123.919 116.987 121.802 116.987Z"
                    fill="#F5F5F5"
                  />
                  <path
                    d="M109.1 95.6498C109.1 92.8056 106.795 90.5 103.951 90.5C101.106 90.5 98.8008 92.8056 98.8008 95.6498C98.8008 97.5548 99.8378 99.2141 101.376 100.105V105.871C101.376 107.293 102.529 108.446 103.951 108.446C105.373 108.446 106.526 107.293 106.526 105.871V100.105C108.063 99.2141 109.1 97.5548 109.1 95.6498Z"
                    fill="#E0E0E0"
                  />
                </svg>
              </div>

              <form className="my-2" onSubmit={verifyOTPAndLogin}>
                <input
                  type="text"
                  name="userOtp"
                  onChange={handleOtpChange}
                  maxLength={6}
                  placeholder="Enter Password"
                />
                <button className="btn" type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="30"
                    viewBox="0 0 35 30"
                    fill="none"
                  >
                    <path
                      d="M6.67453e-05 29.698L34.6473 14.8478L6.67453e-05 0C6.67453e-05 0 0.276248 10.5706 2.03598 11.6998C3.79572 12.829 24.7403 14.5288 24.7488 14.8478C24.7403 15.2144 4.11712 16.511 2.03721 17.7685C-0.0427046 19.0259 6.67453e-05 29.698 6.67453e-05 29.698Z"
                      fill="#466EB6"
                    />
                  </svg>
                </button>
              </form>
           
              {otpError && (
                <>
                  <span style={{ display: "block" }} className="error">
                    Invalid Password
                  </span>
                </>
              )}
            </div>
          )}
          {currentStep === "registration" && (
            <div className="registration-form text-center">
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <input
                  type="text"
                  value={studentDetails.firstName}
                  onChange={handleChange}
                  name="firstName"
                  className="mb-4"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  value={studentDetails.lastName}
                  onChange={handleChange}
                  name="lastName"
                  className="mb-4"
                  placeholder="Last Name"
                  required
                />
                <input
                  type="email"
                  value={studentDetails.email}
                  onChange={handleChange}
                  name="email"
                  className="mb-4"
                  placeholder="Email Address"
                  required
                />
                <input
                  type="text"
                  value={studentDetails.phone}
                  onChange={handleChange}
                  name="phone"
                  className="mb-4"
                  placeholder="Contact Number"
                  required
                  disabled
                />

                <input
                  onChange={handleChange}
                  name="dob"
                  type="date"
                  className="mb-4"
                  required
                />


                <button
                  className="btn btn-primary text-center mb-1"
                  type="submit"
                >
                  Submit
                </button>
                <span className="mt-3">
                  By providing my number, I hereby agree and accept the{" "}
                  <a href="/">Terms & Conditions</a> and{" "}
                  <a href="/">Privacy Policy</a> in use of the Pride Educare App
                </span>
                {registrationError && (
                  <p className="error">{registrationError}</p>
                )}
              </form>
            </div>
          )}
          {/* <div className="button-container text-center mt-2">
            <button
              onClick={() => setCurrentStep("login")}
              className={`btn btn-outline-primary login-button me-2 ${
                currentStep === "login" && "active"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentStep("registration")}
              className={`btn btn-outline-primary ms-2 register-button ${
                currentStep === "registration" && "active"
              }`}
            >
              Registration
            </button>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default Login;
