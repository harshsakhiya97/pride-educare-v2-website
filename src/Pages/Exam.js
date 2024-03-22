import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import axios from "../helper/axios";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

const Exam = () => {
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const progressBarStyle = {
    width: "90%",
    borderRadius: "5px",
  };

  const [examResponse, setExamData] = useState([]);
  const [result, setResult] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    enterFullscreen();
    return () => {
      exitFullscreen();
    };
  }, []);

  useEffect(() => {
    const blockActions = (e) => {
      e.preventDefault();
    };

    window.addEventListener("contextmenu", blockActions);
    window.addEventListener("keydown", blockActions);

    return () => {
      window.removeEventListener("contextmenu", blockActions);
      window.removeEventListener("keydown", blockActions);
    };
  }, []);

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };

  const setCurrentMCQ = (examResponse, mcqIndex) => {
    setIsOptionSelected(false);
    setSelectedOption(0);
    setCurrentQuestionIndex(mcqIndex);
    console.log(examResponse);
    if (
      examResponse?.mcqList[mcqIndex]?.answerOptionMaster &&
      examResponse?.mcqList[mcqIndex]?.answerOptionMaster?.mcqOptionMasterId
    ) {
      setSelectedOption(
        examResponse?.mcqList[mcqIndex]?.answerOptionMaster?.mcqOptionMasterId
      );
    }
  };

  const endExam = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          `/exam/saveExamResult/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setLoading(false);
          console.log("Exam Ended Successfully", response.data.data);
          navigate(-1);
        });
    } catch (error) {
      setLoading(false);
      console.error("Error Ending Exam", error);
    }
  };

  const examSubmit = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          `/exam/saveExamResult/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setLoading(false);
          console.log("Exam Completed Successfully", response.data.data);
          setResult(response.data.data);
          setShowSuccessModal(true);
        });
    } catch (error) {
      setLoading(false);
      console.error("Error Submitting Exam", error);
    }
  };

  const [countDown, setCountDown] = useState(30*60);
  const [timerRunning, setTimerRunning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning) {
        setCountDown((prevCountDown) => {
          if (prevCountDown > 0) {
            return prevCountDown - 1;
          } else {
            setTimerRunning(false);
            examSubmit();
            return 0;
          }
        });
        if (countDown === 300) {
          setShowWarningModal(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown, timerRunning]);

  const minutes = Math.floor(countDown / 60);
  const seconds = countDown - minutes * 60;

  useEffect(() => {
    getExamMCQList(0);
  }, []);

  const getExamMCQList = async (mcqIndex) => {
    setLoading(true);
    try {
      const response = await axios.get(`exam/getExamMcq/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setExamData(response.data.data);
      setCurrentMCQ(response.data.data, mcqIndex);
    } catch (error) {
      setLoading(false);
      console.error("Error Fetching Question Data", error);
    }
  };

  // console.log("examResponse", examResponse);

  const handleOptionSubmit = (e, mcqOptionMasterId, examMCQMaster) => {
    e.preventDefault();

    if (mcqOptionMasterId == 0) {
      setIsOptionSelected(true);
      return;
    }
    setLoading(true);
    axios
      .post(
        `exam/saveExamMcqAnswer/${examMCQMaster.examMCQMasterId}`,
        {
          mcqOptionMasterId: mcqOptionMasterId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setLoading(false);

        examMCQMaster.answerOptionMaster = examMCQMaster.options.find(x=>x.mcqOptionMasterId == mcqOptionMasterId);

        setCurrentMCQ(examResponse, currentQuestionIndex + 1);
        // getExamMCQList(currentQuestionIndex + 1);
        // if (currentQuestionIndex == lectureData?.mcqList?.length - 1) {
        //   fetchResultData();
        // }
        setIsOptionSelected(false);
        if (currentQuestionIndex === examResponse?.mcqList?.length - 1) {
          examSubmit();
        }
        // setCurrentQuestionIndex(currentQuestionIndex + 1);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error submitting MCQ answer:", error);
      });
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
    // navigate(-1);
  };

  return (
    <>
      {loading ? ( <Loading /> ) : (<></>)}

      <div className="container w-50 my-4 user-select-none">
        <div className="row my-5"></div>

        {examResponse && (
          <>
            <div className="lecture-progress-block card-shadow mb-5">
              <div className="px-0">
                <h3 className="exam-section-heading">
                  {currentQuestionIndex + 1}/{examResponse?.mcqList?.length}
                  <a className="exam-duration">
                    <svg
                      className="me-2"
                      width="28"
                      height="28"
                      viewBox="0 0 54 54"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.1712 1.50489C19.7663 1.61338 19.3644 1.7328 18.9645 1.85988L19.5792 3.80382C19.9466 3.68663 20.316 3.5771 20.6989 3.47448C33.6982 -0.00866029 47.045 7.69715 50.5282 20.6964C54.0113 33.6956 46.3055 47.0425 33.3063 50.5256C23.5021 53.1526 13.5003 49.4176 7.68198 41.8407L10.4619 40.1224L4.15701 37.7891L3.67044 44.3111L5.94145 42.9169C12.2287 51.2242 23.1545 55.3568 33.834 52.4952C47.9056 48.7247 56.2682 34.2402 52.4978 20.1686C48.7273 6.09707 34.2428 -2.26557 20.1712 1.50489ZM16.8608 2.63115C15.4568 3.21258 14.1398 3.89972 12.8858 4.69077L13.9996 6.39659C15.1432 5.675 16.3688 5.04051 17.6459 4.51067L16.8608 2.63115ZM11.0671 5.9568C9.85836 6.87294 8.74516 7.8831 7.72488 8.97742L9.21033 10.3632C10.1486 9.35652 11.1773 8.42528 12.2887 7.58332L11.0671 5.9568ZM6.25933 10.686C5.34136 11.8548 4.52325 13.0987 3.81364 14.4046L5.60163 15.3656C6.2527 14.1627 7.0127 13.0161 7.85058 11.9413L7.13273 11.3632L6.25933 10.686ZM14.1157 9.58711L14.1455 11.6244L39.5166 11.3328L39.4879 9.29988L14.1157 9.58711ZM2.82962 16.4133C2.23252 17.7695 1.75079 19.1887 1.38766 20.6347L3.35812 21.1387C3.69108 19.7946 4.13683 18.4907 4.68662 17.2293L2.82962 16.4133ZM17.0531 13.6342C17.3886 16.5935 18.9779 19.5922 20.9289 21.884C22.0221 23.1626 23.2216 24.2251 24.3163 24.9404C24.9136 25.3315 25.4788 25.6023 25.9708 25.7754L26.0015 28.2534C25.5099 28.4321 24.9542 28.7217 24.3592 29.1274C23.2779 29.8628 22.1037 30.9515 21.0457 32.2553C19.1396 34.5955 17.6269 37.6161 17.3663 40.5827L36.9521 40.3659C36.6166 37.4066 35.0273 34.4079 33.0763 32.1161C31.9831 30.8375 30.7836 29.775 29.6889 29.0597C29.0916 28.6686 28.5264 28.3978 28.0344 28.2247L28.0037 25.7467C28.4815 25.56 29.051 25.2784 29.646 24.8727C30.7273 24.1373 31.9015 23.0487 32.9595 21.7449C34.8656 19.4046 36.3783 16.384 36.6389 13.4174L17.0531 13.6342ZM0.93386 22.8321C0.702477 24.3014 0.587866 25.7864 0.604995 27.2946L2.64082 27.2417C2.6264 25.8617 2.73094 24.4967 2.94568 23.1491L0.93386 22.8321ZM0.728797 29.5249C0.866598 30.954 1.12336 32.398 1.50744 33.8315L1.53383 33.9299L3.49755 33.3803L3.47703 33.3037C3.12226 31.9797 2.88497 30.6477 2.75605 29.3218L0.728797 29.5249ZM14.4886 42.6673L14.5173 44.7002L39.8889 44.4108L39.8602 42.3779L14.4886 42.6673Z"
                        fill="#6A97CF"
                      />
                    </svg>
                    {minutes}:{seconds}
                    <button
                      onClick={() => setShowFailureModal(true)}
                      className="btn btn-outline-danger text-center ms-3"
                    >
                      <span className="fw-bold">End Exam</span>
                    </button>
                  </a>
                </h3>

                <div className="course-progress-bar">
                  <div className="progress" style={progressBarStyle}>
                    <div
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) /
                            examResponse?.mcqList?.length) *
                          100
                        }%`,
                        borderRadius: "5px",
                      }}
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={currentQuestionIndex + 1}
                      aria-valuemin="0"
                      aria-valuemax={examResponse?.mcqList?.length}
                    ></div>
                  </div>
                  <span>
                    {currentQuestionIndex + 1} / {examResponse?.mcqList?.length}
                  </span>
                </div>
                <div className="mt-4 px-4">
                  <p className="question my-4">
                    Question {currentQuestionIndex + 1}
                  </p>
                  {currentQuestionIndex <=
                    examResponse?.mcqList?.length - 1 && (
                    <>
                      <h2 className="question-head my-4">
                        {
                          examResponse?.mcqList[currentQuestionIndex]?.question
                            ?.title
                        }
                      </h2>

                      <div className="msp-ans-module">
                        <ul className="msp-ans-list p-0 m-0">
                          {examResponse?.mcqList[
                            currentQuestionIndex
                          ]?.options?.map((option, optionIndex) => (
                            <label className="radio-label w-100">
                              <li
                                key={option.mcqOptionMasterId}
                                className={`${
                                  selectedOption === option.mcqOptionMasterId
                                    ? "selected"
                                    : ""
                                }`}
                              >
                                {/* {currentQuestionIndex + 1} -{" "}
                                {option.mcqOptionMasterId} - {selectedOption} */}
                                <input
                                  type="radio"
                                  name="options"
                                  style={{ display: "none" }}
                                  value={option.mcqOptionMasterId}
                                  checked={
                                    selectedOption === option.mcqOptionMasterId
                                  }
                                  onChange={() =>
                                    handleOptionChange(option.mcqOptionMasterId)
                                  }
                                />
                                <span className="ms-2">
                                  {option.option.title}
                                </span>
                              </li>
                            </label>
                          ))}
                        </ul>
                        <div className="btn-list">
                          {isOptionSelected && (
                            <span className="error resend">
                              Please Select Atleast One Option
                            </span>
                          )}
                          {currentQuestionIndex > 0 && (
                            <>
                              <Link
                                onClick={() =>
                                  setCurrentMCQ(
                                    examResponse,
                                    currentQuestionIndex - 1
                                  )
                                }
                              >
                                Previous
                              </Link>
                            </>
                          )}
                          {currentQuestionIndex <
                            examResponse?.mcqList?.length && (
                            <Link
                              onClick={(e) =>
                                handleOptionSubmit(
                                  e,
                                  selectedOption,
                                  examResponse?.mcqList[currentQuestionIndex]
                                )
                              }
                              className="active-btn"
                            >
                              SAVE / NEXT
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        show={showFailureModal}
        className="payment-modal"
        onHide={() => setShowFailureModal(false)}
        centered
      >
        <Modal.Body className="p-0 user-select-none">
          <div className="success-block w-100">
            <div className="exam-success-tick-block red-bg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="147"
                height="146"
                viewBox="0 0 147 146"
                fill="none"
              >
                <path
                  d="M125.467 145.699H21.4348C5.52115 145.699 -4.82914 129.083 2.28758 114.961L54.3033 11.7412C62.1924 -3.91374 84.7086 -3.91374 92.5977 11.7412L144.613 114.96C151.731 129.083 141.38 145.699 125.467 145.699Z"
                  fill="url(#paint0_linear_727_20114)"
                />
                <path
                  d="M125.467 145.699H21.4348C5.52115 145.699 -4.82914 129.083 2.28758 114.961L54.3033 11.7412C62.1924 -3.91374 84.7086 -3.91374 92.5977 11.7412L144.613 114.96C151.731 129.083 141.38 145.699 125.467 145.699Z"
                  fill="#EC654D"
                />
                <path
                  d="M126.04 145.7H112.84L68.2913 122.781C66.8914 122.1 65.8163 118.688 64.9913 116.232C64.9913 109.893 63.8656 83.9226 63.3414 69.5757C62.8172 55.2317 61.6914 52.1771 61.6914 45.8382C63.3414 39.2899 68.2913 40.927 68.2913 40.1085C69.9412 40.1084 71.8791 39.3091 74.0855 39.3091C76.2919 39.3091 81.6714 39.2899 83.9659 42.564C84.1647 42.7812 121.039 84.2648 135.94 99.043L144.189 114.595C152.439 129.329 140.89 145.7 126.04 145.7Z"
                  fill="#EB4335"
                />
                <path
                  d="M113.898 145.698H92.4734L67.9121 121.329C66.2789 119.9 65.4609 118.234 65.4609 116.327C65.4609 114.341 66.2789 112.652 67.9121 111.263C69.5452 109.874 71.5298 109.18 73.8631 109.18C75.9168 109.18 77.694 109.874 79.1917 111.263L113.898 145.698Z"
                  fill="#EB4335"
                />
                <path
                  d="M61.8477 45.7517C61.8477 43.6891 63.0015 42.0959 65.3107 40.9736C67.6189 39.8513 70.6084 39.2896 74.2792 39.2896C77.9499 39.2896 80.6467 39.8739 82.3663 41.0415C84.0854 42.2091 84.9471 43.7788 84.9471 45.7517C84.9471 52.2165 84.7628 55.2194 84.4024 69.8493C84.0382 84.4797 83.8582 89.0898 83.8582 95.5519C83.8582 96.9004 82.8198 97.9559 80.746 98.7177C78.6688 99.4797 76.5134 99.8612 74.2796 99.8612C67.7359 99.8612 64.4633 98.4259 64.4633 95.5519C64.4633 89.0898 64.027 84.4797 63.1557 69.8493C62.283 55.2191 61.8477 52.2162 61.8477 45.7517Z"
                  fill="white"
                />
                <circle cx="73.3943" cy="120.151" r="8.24981" fill="white" />
                <defs>
                  <linearGradient
                    id="paint0_linear_727_20114"
                    x1="36.8434"
                    y1="62.3159"
                    x2="203.104"
                    y2="229.885"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFB92D" />
                    <stop offset="1" stopColor="#F59500" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="38"
                className="blue-triangle"
                viewBox="0 0 80 38"
                fill="none"
              >
                <path
                  d="M38.0229 37.1732C39.1548 38.166 40.8473 38.166 41.9792 37.1732L78.1604 5.43969C80.2417 3.61427 78.9506 0.184277 76.1822 0.184277H3.8199C1.05154 0.184277 -0.239513 3.61427 1.84175 5.43969L38.0229 37.1732Z"
                  fill="#FFCDC5"
                />
              </svg>
            </div>
            <div className="exam-success-text-block">
              <div className="exam-course-title">
                Do you really want to end the exam...?
              </div>

              <div className="exam-text mt-3 text-center">
                If you click the button below your exam will end and you will
                get certificate based on answers you have appeared till now...!
              </div>

              <div className="btn-list text-center mt-5">
                <Link
                  className="end-btn"
                  onClick={() => setShowFailureModal(false)}
                >
                  Close
                </Link>
                <Link className="end-btn ms-2" onClick={() => endExam()}>
                  End Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    className="ms-2"
                  >
                    <path
                      d="M8.70071 13.6584C8.60108 13.5501 8.52205 13.4214 8.46813 13.2798C8.4142 13.1382 8.38645 12.9864 8.38645 12.833C8.38645 12.6797 8.4142 12.5279 8.46813 12.3863C8.52205 12.2447 8.60108 12.116 8.70071 12.0077L12.2281 8.16599L1.07152 8.15782C0.787333 8.15782 0.514787 8.03491 0.313839 7.81613C0.11289 7.59734 0 7.30061 0 6.9912C0 6.6818 0.11289 6.38506 0.313839 6.16628C0.514787 5.94749 0.787333 5.82458 1.07152 5.82458L12.2303 5.83275L8.70071 1.99224C8.49965 1.77349 8.38664 1.47674 8.38654 1.16727C8.38644 0.857799 8.49926 0.560961 8.70017 0.342056C8.90109 0.12315 9.17365 0.000109468 9.45789 7.30087e-08C9.74213 -0.000109322 10.0148 0.122722 10.2158 0.341473L14.0583 4.52497C14.3568 4.84997 14.5937 5.23582 14.7553 5.66048C14.9168 6.08514 15 6.54029 15 6.99995C15 7.45961 14.9168 7.91476 14.7553 8.33943C14.5937 8.76409 14.3568 9.14993 14.0583 9.47493L10.2158 13.6584C10.0149 13.8771 9.7424 14 9.45827 14C9.17414 14 8.90165 13.8771 8.70071 13.6584Z"
                      fill="white"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        backdrop="static"
        keyboard={false}
        className="payment-modal"
        centered
      >
        <Modal.Body className="p-0 user-select-none">
          <div className="success-block w-100">
            <div className="exam-success1-tick-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="93"
                height="93"
                viewBox="0 0 93 93"
                fill="none"
              >
                <g clipPath="url(#clip0_727_17414)">
                  <path
                    d="M46.5 93C72.1812 93 93 72.1812 93 46.5C93 20.8188 72.1812 0 46.5 0C20.8188 0 0 20.8188 0 46.5C0 72.1812 20.8188 93 46.5 93Z"
                    fill="#6487C9"
                  />
                  <path
                    d="M34.6172 67.4763L58.5273 91.3864C78.3301 86.1056 92.9989 68.063 92.9989 46.4999C92.9989 46.0599 92.9989 45.6198 92.9989 45.1798L74.2229 27.8706L34.6172 67.4763Z"
                    fill="#466EB6"
                  />
                  <path
                    d="M47.6724 56.9149C49.726 58.9685 49.726 62.489 47.6724 64.5427L43.4184 68.7966C41.3648 70.8502 37.8443 70.8502 35.7907 68.7966L17.1613 50.0206C15.1077 47.9669 15.1077 44.4464 17.1613 42.3928L21.4153 38.1389C23.4689 36.0852 26.9894 36.0852 29.043 38.1389L47.6724 56.9149Z"
                    fill="white"
                  />
                  <path
                    d="M63.956 24.4969C66.0097 22.4433 69.5302 22.4433 71.5838 24.4969L75.8377 28.7508C77.8914 30.8045 77.8914 34.325 75.8377 36.3786L43.5665 68.5032C41.5128 70.5568 37.9923 70.5568 35.9387 68.5032L31.6848 64.2492C29.6311 62.1956 29.6311 58.6751 31.6848 56.6215L63.956 24.4969Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_727_17414">
                    <rect width="93" height="93" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="53"
                height="25"
                viewBox="0 5 53 25"
                fill="none"
                className="blue-triangle"
              >
                <path
                  d="M24.6814 23.6119C25.7559 24.4317 27.2459 24.4317 28.3205 23.6119L51.0863 6.24485C53.3686 4.50375 52.1373 0.859646 49.2667 0.859646H3.73516C0.864535 0.859646 -0.36674 4.50374 1.9156 6.24484L24.6814 23.6119Z"
                  fill="#DDEEFD"
                />
              </svg>
            </div>
            <div className="exam-success-text-block">
              <div className="exam-course-title">
                Your exam has been successfully completed...!
              </div>

              <div className="exam-text mt-3 text-center">
                Congratulations You have scored{" "}
                {result ? (
                  <>
                    <Link className="d-block">"{result?.examMarks}" Marks</Link>
                  </>
                ) : (
                  <>
                    <Link className="d-block">Loading ...</Link>
                  </>
                )}
                & your certificate is now available
              </div>

              <div className="btn-list text-center mt-5">
                <a className="btn support-btn" onClick={navigateToDashboard}>
                  View Certificate
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="24"
                    viewBox="0 0 19 24"
                    fill="none"
                  >
                    <path
                      d="M8 12C8.26522 12 8.51957 12.1054 8.70711 12.2929C8.89464 12.4804 9 12.7348 9 13C9 13.2652 8.89464 13.5196 8.70711 13.7071C8.51957 13.8946 8.26522 14 8 14H5C4.73478 14 4.48043 13.8946 4.29289 13.7071C4.10536 13.5196 4 13.2652 4 13C4 12.7348 4.10536 12.4804 4.29289 12.2929C4.48043 12.1054 4.73478 12 5 12H8ZM14 9C14 8.73478 13.8946 8.48043 13.7071 8.29289C13.5196 8.10536 13.2652 8 13 8H5C4.73478 8 4.48043 8.10536 4.29289 8.29289C4.10536 8.48043 4 8.73478 4 9C4 9.26522 4.10536 9.51957 4.29289 9.70711C4.48043 9.89464 4.73478 10 5 10H13C13.2652 10 13.5196 9.89464 13.7071 9.70711C13.8946 9.51957 14 9.26522 14 9ZM5 6H13C13.2652 6 13.5196 5.89464 13.7071 5.70711C13.8946 5.51957 14 5.26522 14 5C14 4.73478 13.8946 4.48043 13.7071 4.29289C13.5196 4.10536 13.2652 4 13 4H5C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5C4 5.26522 4.10536 5.51957 4.29289 5.70711C4.48043 5.89464 4.73478 6 5 6ZM17 19.444V23.277C17.0001 23.4197 16.9578 23.5591 16.8786 23.6777C16.7994 23.7964 16.6868 23.8888 16.555 23.9434C16.4232 23.998 16.2781 24.0123 16.1382 23.9845C15.9983 23.9566 15.8698 23.8879 15.769 23.787L15 23.019L14.231 23.787C14.1302 23.8879 14.0017 23.9566 13.8618 23.9845C13.7219 24.0123 13.5768 23.998 13.445 23.9434C13.3132 23.8888 13.2006 23.7964 13.1214 23.6777C13.0422 23.5591 12.9999 23.4197 13 23.277V19.444C12.2373 19.0058 11.641 18.3277 11.3038 17.5154C10.9666 16.703 10.9076 15.8019 11.1358 14.9525C11.364 14.103 11.8667 13.3529 12.5656 12.8189C13.2646 12.2849 14.1204 11.997 15 12C15.338 12.0042 15.6741 12.0519 16 12.142V5C16 4.20435 15.6839 3.44129 15.1213 2.87868C14.5587 2.31607 13.7956 2 13 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H10C10.2652 20 10.5196 20.1054 10.7071 20.2929C10.8946 20.4804 11 20.7348 11 21C11 21.2652 10.8946 21.5196 10.7071 21.7071C10.5196 21.8946 10.2652 22 10 22H5C3.67441 21.9984 2.40356 21.4711 1.46622 20.5338C0.528882 19.5964 0.00158786 18.3256 0 17V5C0.00158786 3.67441 0.528882 2.40356 1.46622 1.46622C2.40356 0.528882 3.67441 0.00158786 5 0L13 0C14.3256 0.00158786 15.5964 0.528882 16.5338 1.46622C17.4711 2.40356 17.9984 3.67441 18 5V13.382C18.3917 13.8219 18.6801 14.3438 18.844 14.9096C19.0079 15.4753 19.0433 16.0706 18.9474 16.6518C18.8515 17.2329 18.6269 17.7853 18.2899 18.2684C17.953 18.7516 17.5122 19.1532 17 19.444ZM17 16C17 15.6044 16.8827 15.2178 16.6629 14.8889C16.4432 14.56 16.1308 14.3036 15.7654 14.1522C15.3999 14.0009 14.9978 13.9613 14.6098 14.0384C14.2219 14.1156 13.8655 14.3061 13.5858 14.5858C13.3061 14.8655 13.1156 15.2219 13.0384 15.6098C12.9613 15.9978 13.0009 16.3999 13.1522 16.7654C13.3036 17.1308 13.56 17.4432 13.8889 17.6629C14.2178 17.8827 14.6044 18 15 18C15.5304 18 16.0391 17.7893 16.4142 17.4142C16.7893 17.0391 17 16.5304 17 16Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showWarningModal}
        className="payment-modal"
        onHide={() => setShowWarningModal(false)}
        centered
      >
        <Modal.Body className="p-0 user-select-none">
          <div className="success-block w-100">
            <div className="exam-success-tick-block red-bg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="147"
                height="146"
                viewBox="0 0 147 146"
                fill="none"
              >
                <path
                  d="M125.467 145.699H21.4348C5.52115 145.699 -4.82914 129.083 2.28758 114.961L54.3033 11.7412C62.1924 -3.91374 84.7086 -3.91374 92.5977 11.7412L144.613 114.96C151.731 129.083 141.38 145.699 125.467 145.699Z"
                  fill="url(#paint0_linear_727_20114)"
                />
                <path
                  d="M125.467 145.699H21.4348C5.52115 145.699 -4.82914 129.083 2.28758 114.961L54.3033 11.7412C62.1924 -3.91374 84.7086 -3.91374 92.5977 11.7412L144.613 114.96C151.731 129.083 141.38 145.699 125.467 145.699Z"
                  fill="#EC654D"
                />
                <path
                  d="M126.04 145.7H112.84L68.2913 122.781C66.8914 122.1 65.8163 118.688 64.9913 116.232C64.9913 109.893 63.8656 83.9226 63.3414 69.5757C62.8172 55.2317 61.6914 52.1771 61.6914 45.8382C63.3414 39.2899 68.2913 40.927 68.2913 40.1085C69.9412 40.1084 71.8791 39.3091 74.0855 39.3091C76.2919 39.3091 81.6714 39.2899 83.9659 42.564C84.1647 42.7812 121.039 84.2648 135.94 99.043L144.189 114.595C152.439 129.329 140.89 145.7 126.04 145.7Z"
                  fill="#EB4335"
                />
                <path
                  d="M113.898 145.698H92.4734L67.9121 121.329C66.2789 119.9 65.4609 118.234 65.4609 116.327C65.4609 114.341 66.2789 112.652 67.9121 111.263C69.5452 109.874 71.5298 109.18 73.8631 109.18C75.9168 109.18 77.694 109.874 79.1917 111.263L113.898 145.698Z"
                  fill="#EB4335"
                />
                <path
                  d="M61.8477 45.7517C61.8477 43.6891 63.0015 42.0959 65.3107 40.9736C67.6189 39.8513 70.6084 39.2896 74.2792 39.2896C77.9499 39.2896 80.6467 39.8739 82.3663 41.0415C84.0854 42.2091 84.9471 43.7788 84.9471 45.7517C84.9471 52.2165 84.7628 55.2194 84.4024 69.8493C84.0382 84.4797 83.8582 89.0898 83.8582 95.5519C83.8582 96.9004 82.8198 97.9559 80.746 98.7177C78.6688 99.4797 76.5134 99.8612 74.2796 99.8612C67.7359 99.8612 64.4633 98.4259 64.4633 95.5519C64.4633 89.0898 64.027 84.4797 63.1557 69.8493C62.283 55.2191 61.8477 52.2162 61.8477 45.7517Z"
                  fill="white"
                />
                <circle cx="73.3943" cy="120.151" r="8.24981" fill="white" />
                <defs>
                  <linearGradient
                    id="paint0_linear_727_20114"
                    x1="36.8434"
                    y1="62.3159"
                    x2="203.104"
                    y2="229.885"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFB92D" />
                    <stop offset="1" stopColor="#F59500" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="38"
                className="blue-triangle"
                viewBox="0 0 80 38"
                fill="none"
              >
                <path
                  d="M38.0229 37.1732C39.1548 38.166 40.8473 38.166 41.9792 37.1732L78.1604 5.43969C80.2417 3.61427 78.9506 0.184277 76.1822 0.184277H3.8199C1.05154 0.184277 -0.239513 3.61427 1.84175 5.43969L38.0229 37.1732Z"
                  fill="#FFCDC5"
                />
              </svg>
            </div>
            <div className="exam-success-text-block">
              <div className="exam-course-title">
                You Have Left With 5 Minutes !
              </div>

              {/* <div className="exam-text mt-3 text-center">
                If you click the button below your exam will end and you will
                get certificate based on answers you have appeared till now...!
              </div> */}

              <div className="btn-list text-center mt-5">
                <Link
                  className="end-btn"
                  onClick={() => setShowWarningModal(false)}
                >
                  Close
                </Link>
                {/* <Link className="end-btn ms-2">
                  End Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    className="ms-2"
                  >
                    <path
                      d="M8.70071 13.6584C8.60108 13.5501 8.52205 13.4214 8.46813 13.2798C8.4142 13.1382 8.38645 12.9864 8.38645 12.833C8.38645 12.6797 8.4142 12.5279 8.46813 12.3863C8.52205 12.2447 8.60108 12.116 8.70071 12.0077L12.2281 8.16599L1.07152 8.15782C0.787333 8.15782 0.514787 8.03491 0.313839 7.81613C0.11289 7.59734 0 7.30061 0 6.9912C0 6.6818 0.11289 6.38506 0.313839 6.16628C0.514787 5.94749 0.787333 5.82458 1.07152 5.82458L12.2303 5.83275L8.70071 1.99224C8.49965 1.77349 8.38664 1.47674 8.38654 1.16727C8.38644 0.857799 8.49926 0.560961 8.70017 0.342056C8.90109 0.12315 9.17365 0.000109468 9.45789 7.30087e-08C9.74213 -0.000109322 10.0148 0.122722 10.2158 0.341473L14.0583 4.52497C14.3568 4.84997 14.5937 5.23582 14.7553 5.66048C14.9168 6.08514 15 6.54029 15 6.99995C15 7.45961 14.9168 7.91476 14.7553 8.33943C14.5937 8.76409 14.3568 9.14993 14.0583 9.47493L10.2158 13.6584C10.0149 13.8771 9.7424 14 9.45827 14C9.17414 14 8.90165 13.8771 8.70071 13.6584Z"
                      fill="white"
                    />
                  </svg>
                </Link> */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Exam;
