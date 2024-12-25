import React, { useState, useEffect, useContext, useRef } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../helper/axios";
import { saveAs } from "file-saver";
import Vimeo from "@vimeo/player";
import video from "../assets/Video.svg";
import AttendanceBatchListModal from "./AttendanceBatchListModal";
import Loading from "../components/Loading";

const LectureDetails = () => {
  const { id, lecID } = useParams();
  const { token } = useContext(AuthContext);
  const [lectureData, setLectureData] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [hideFileSelected, setHideFileSelected] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [enrollDetails, setEnrollDetails] = useState([]);
  const navigate = useNavigate();
  const vimeoPlayerRef = useRef(null);
  const [lectureId, setLectureId] = useState(lecID);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [attendanceBatchListData, setAttendanceBatchList] = useState({});
  const [isModalData, setModalData] = useState(false);
  const [playVideo, setVideo] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchEnrollCourseDetails();
    fetchLectureDetails(0);

    fetchAttendanceBatchList();
  }, [token]);

  const fetchEnrollCourseDetails = async () => {
    try {
      const res = await axios.get(`enroll/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnrollDetails(res.data.data);
    } catch (error) {
      console.error("Error Fetching Data", error);
    }
  };

  const fetchLectureDetails = async (mcqIndex) => {
    try {
      setLoading(true);
      const response = await axios.get(`studentLecture/${lectureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      setLectureData(response.data.data);
      setVideo(response.data.data?.videoList?.length > 0 ? response.data.data?.videoList[0] : {})
      setCurrentMCQ(response.data.data, mcqIndex);
    } catch (error) {
      setLoading(false);
      console.error("Error Fetching Lecture Data", error);
    }
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };

  const setCurrentMCQ = (lectureData, mcqIndex) => {
    setIsOptionSelected(false);
    setSelectedOption(0);
    setCurrentQuestionIndex(mcqIndex);
    if (lectureData?.mcqList && lectureData?.mcqList.length > mcqIndex &&
      lectureData?.mcqList[mcqIndex]?.answerOptionMaster &&
      lectureData?.mcqList[mcqIndex]?.answerOptionMaster?.mcqOptionMasterId
    ) {
      setSelectedOption(
        lectureData?.mcqList[mcqIndex]?.answerOptionMaster?.mcqOptionMasterId
      );
    }
  };

  const fetchAttendanceBatchList = async (selectedID = lectureId) => {
    try {
      const response = await axios.get(`attendance/batchList/${selectedID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttendanceBatchList(response.data.data);
    } catch (error) {
      console.error("Error Fetching Lecture Data", error);
    }
  }

  const fetchEnrollLectureData = async (selectedID = lectureId) => {
    fetchAttendanceBatchList(selectedID);
    setLoading(true);
    try {
      const response = await axios.get(`studentLecture/${selectedID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHideFileSelected(true);
      setFileSelected(false);
      setLectureData(response.data.data);
      setCurrentMCQ(response.data.data, 0);
      setLectureId(selectedID);
      setLoading(false);
      setVideo(response.data.data?.videoList?.length > 0 ? response.data.data?.videoList[0] : {})
      navigate(`/lecture-detail/${id}/${selectedID}`);
      fetchResultData(selectedID);
    } catch (error) {
      console.error("Error Fetching Lecture Data", error);
    }
  };

  useEffect(() => {
    if (lectureId) {
      const element = document.getElementById(lectureId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [lectureId]);

  const progressBarStyle = {
    width: "100%",
    borderRadius: "5px",
  };

  const innerBarStyle = {
    width: `${lectureData.completePercent}%`,
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const handleFileSelect = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setFileSelected(true);
      setHideFileSelected(false);
    } else {
      setFileSelected(false);
      setHideFileSelected(true);
    }
  };

  const handleUploadFile = async (e, id) => {
    if (fileSelected) {
      e.preventDefault();
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("assignmentFile", selectedFile);

        const response = await axios.post(
          `studentLectureContent/uploadAssignment/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setLoading(false);
        fetchLectureDetails(currentQuestionIndex);

        // console.log("Upload Response", response.data.data.uploadedAssignment);
      } catch (error) {
        setLoading(false);
        console.error("Error Uploading File", error);
      }
    }
  };

  const handleFileDownload = (e, file, fileName) => {
    e.preventDefault();
    saveAs(file, fileName);
  };

  useEffect(() => {
    if (showVideo) {
      const player = new Vimeo(vimeoPlayerRef.current, {
        id: playVideo?.linkId,
        autoplay: false,
        height: 520,
        width: 1080,
        pip: true,
        responsive: true,
      });

      // player.on("play", () => {
      // console.log("Video is playing");
      // });

      player.on("pause", (data) => {
        const currentTime = data.seconds;
        const duration = data.duration;
        updateLastWatchedTime(currentTime, duration);
      });

      const updateLastWatchedTime = async (time, duration) => {
        try {
          await axios.post(
            `studentLectureContent/updateWatchedTime/${playVideo?.studentLectureContentMasterId}`,
            { lastWatchedTime: time, totalDuration: duration },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // console.log("Last watched time updated successfully.", time);
        } catch (error) {
          console.error("Error updating last watched time:", error);
        }
      };

      const fetchLastWatchedTime = async () => {
        if (playVideo?.lastWatchedTime) {
          player.setCurrentTime(playVideo?.lastWatchedTime);
        }
      };

      fetchLastWatchedTime();

      return () => {
        player.destroy();
      };
    }
  }, [showVideo, lectureData]);

  const handleOptionSubmit = (mcqOptionMasterId, studentLectureMCQMasterId) => {
    if (mcqOptionMasterId == 0) {
      setIsOptionSelected(true);
      return;
    }
    setSelectedOption(mcqOptionMasterId);
    setLoading(true);
    axios
      .post(
        `studentLectureMcq/saveMcqAnswer/${studentLectureMCQMasterId}`,
        {
          mcqOptionMasterId: mcqOptionMasterId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // console.log("MCQ answer submitted successfully:", response.data.data);

        setLoading(false);
        fetchLectureDetails(currentQuestionIndex + 1);
        // if (currentQuestionIndex == lectureData?.mcqList?.length - 1) {
        //   fetchResultData();
        // }
        setIsOptionSelected(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error submitting MCQ answer:", error);
      });
  };

  const hasAnswerOptionMaster = lectureData?.mcqList?.every(
    (mcq) => mcq.answerOptionMaster
  );

  // console.log("hasAnswerOptionMaster", hasAnswerOptionMaster);

  useEffect(() => {
    if (
      currentQuestionIndex === lectureData?.mcqList?.length - 1 ||
      hasAnswerOptionMaster
    ) {
      fetchResultData(lectureId);
    }
  }, [
    currentQuestionIndex === lectureData?.mcqList?.length - 1,
    hasAnswerOptionMaster,
    lectureId,
  ]);

  const fetchResultData = async (selectedID) => {
    try {
      const response = await axios.get(
        `studentLectureMcq/getMcqResults/${selectedID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResultData(response.data.data);
    } catch (error) {
      console.error("Error Fetching Lecture Data", error);
    }
  };
  // console.log('isModalData', isModalData);
  return (
    <>
      <DashboardNavbar />
      {loading ? (<Loading />) : (<></>)}
      {
        isModalData &&
        <AttendanceBatchListModal
          show={isModalData}
          hide={() => setModalData(false)}
          data={attendanceBatchListData.list}
          studentLectureMasterId={lectureId}
          fetchEnrollLectureData={() => fetchEnrollLectureData()}
        />
      }
      <div className="container">
        <div className="row pt-5 mb-5">
          <div className="col-4 pe-5">
            {
              attendanceBatchListData && attendanceBatchListData.totalCount > 0 &&
              <Link
                onClick={() => setModalData(true)}
                className="btn btn-primary btn-lg px-5 mb-4"
              >
                Attend Offline
              </Link>}
            <div className="lecture-progress-block card-shadow mb-5">
              <div>
                <h3 className="section-heading">
                  Lecture Progress
                  {/* <Link className="viewall-link">
                    1/{lectureData?.videoList?.length}
                  </Link> */}
                </h3>
              </div>

              <div className="course-progress-bar">
                <div className="progress" style={progressBarStyle}>
                  <div
                    style={innerBarStyle}
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow="50"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <span>{innerBarStyle.width}</span>
              </div>
            </div>

            <div className="lecture-progress-block video-progress-block card-shadow">
              <div className="mb-4">
                <h3 className="section-heading">
                  Video Lectures
                  {/* <Link className="viewall-link">
                    (1/{lectureData?.videoList?.length})
                  </Link> */}
                </h3>
              </div>

              <div className="video-progress-list">
                {enrollDetails?.studentLectureMasterList?.map((lecture) => (
                  <>
                    <div
                      id={lecture.studentLectureMasterId}
                      key={lecture.studentLectureMasterId}
                      className={`video-progress-item ${lectureId == lecture.studentLectureMasterId
                        ? "active"
                        : ""
                        }`}
                      onClick={() =>
                        fetchEnrollLectureData(lecture.studentLectureMasterId)
                      }
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="16" cy="16" r="16" fill="white" />
                        <path
                          d="M12 20.9998C11.817 20.9998 11.635 20.9498 11.474 20.8508C11.3292 20.761 11.2096 20.6357 11.1267 20.4867C11.0438 20.3378 11.0002 20.1703 11 19.9998V11.9998C11 11.6528 11.18 11.3308 11.474 11.1488C11.6191 11.0596 11.7846 11.0087 11.9548 11.001C12.125 10.9933 12.2944 11.029 12.447 11.1048L20.447 15.1048C20.6131 15.188 20.7528 15.3158 20.8504 15.4739C20.948 15.6319 20.9997 15.814 20.9997 15.9998C20.9997 16.1856 20.948 16.3677 20.8504 16.5258C20.7528 16.6838 20.6131 16.8116 20.447 16.8948L12.447 20.8948C12.307 20.9648 12.152 20.9998 12 20.9998Z"
                          fill="#6A97CF"
                        />
                      </svg>

                      <h4>
                        {lecture.sequenceNo}.{" "}
                        {lecture.lectureMaster?.lectureName}
                      </h4>

                      <span>{lecture.lectureMaster?.duration}</span>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="lecture-tab-block">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <span
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="span"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Lecture
                  </span>
                </li>
                <li className="nav-item" role="presentation">
                  <span
                    className="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="span"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    MCQ’s
                  </span>
                </li>
                <li className="nav-item" role="presentation">
                  <span
                    className="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#contact"
                    type="span"
                    role="tab"
                    aria-controls="contact"
                    aria-selected="false"
                  >
                    Assignments
                  </span>
                </li>
                <li className="nav-item" role="presentation">
                  <span
                    className="nav-link"
                    id="contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#notes"
                    type="span"
                    role="tab"
                    aria-controls="contact"
                    aria-selected="false"
                  >
                    Notes
                  </span>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div className="lecture-details-data">
                    {lectureData?.videoList?.length > 0 ? (
                      <>
                        <h1 className="section-heading">
                          {lectureData?.lectureMaster?.sequenceNo}.{" "}
                          {lectureData?.lectureMaster?.lectureName}
                        </h1>

                        <section className="pb-0 mb-0">
                          <div className="container">
                            <div className="row">
                              <div className="col-12 px-0">
                                <div className="video-container">
                                  {showVideo ? (
                                    <>
                                      <div ref={vimeoPlayerRef}></div>
                                      <h3 className="pt-4">
                                        {playVideo?.title}
                                      </h3>
                                    </>
                                  ) : (
                                    <img
                                      src={video}
                                      alt="Video Placeholder"
                                      onClick={toggleVideo}
                                      className="h-100 w-100 object-fit"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                        <div className="video-list-carousel mt-3">
                          {
                            lectureData?.videoList?.map((item) => {
                              return (
                                <div className="video-item link" onClick={() => setVideo(item)}>
                                  <img src={item.videoThumbnail} alt={item.title} />
                                  <h4 className=""> <span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="22"
                                      height="21"
                                      viewBox="0 0 22 21"
                                      fill="none"
                                    >
                                      <path
                                        d="M17.077 20.3246H5.29346C4.17733 20.3236 3.1072 19.8798 2.31798 19.0906C1.52877 18.3014 1.08496 17.2313 1.08398 16.1151V4.33154C1.08496 3.21542 1.52877 2.14529 2.31798 1.35607C3.1072 0.566852 4.17733 0.123043 5.29346 0.12207L17.077 0.12207C18.1932 0.123043 19.2633 0.566852 20.0525 1.35607C20.8417 2.14529 21.2855 3.21542 21.2865 4.33154V16.1151C21.2855 17.2313 20.8417 18.3014 20.0525 19.0906C19.2633 19.8798 18.1932 20.3236 17.077 20.3246ZM5.29346 1.80623C4.6237 1.80623 3.98138 2.07229 3.50779 2.54587C3.0342 3.01946 2.76814 3.66179 2.76814 4.33154V16.1151C2.76814 16.7849 3.0342 17.4272 3.50779 17.9008C3.98138 18.3744 4.6237 18.6404 5.29346 18.6404H17.077C17.7468 18.6404 18.3891 18.3744 18.8627 17.9008C19.3363 17.4272 19.6024 16.7849 19.6024 16.1151V4.33154C19.6024 3.66179 19.3363 3.01946 18.8627 2.54587C18.3891 2.07229 17.7468 1.80623 17.077 1.80623H5.29346ZM8.94828 14.4365C8.59711 14.4355 8.25244 14.3417 7.94917 14.1647C7.64832 13.9944 7.39821 13.7472 7.22456 13.4483C7.0509 13.1494 6.95996 12.8097 6.96108 12.464V7.98269C6.96148 7.63877 7.05204 7.30096 7.22374 7.00297C7.39544 6.70497 7.64227 6.4572 7.93961 6.28437C8.23695 6.11155 8.57441 6.0197 8.91832 6.01799C9.26224 6.01629 9.60059 6.10479 9.89963 6.27466L14.3589 8.49326C14.6674 8.66005 14.9256 8.90627 15.107 9.20643C15.2883 9.50659 15.3861 9.84978 15.3902 10.2004C15.3944 10.5511 15.3047 10.8965 15.1304 11.2008C14.9562 11.5052 14.7038 11.7574 14.3993 11.9314L9.87392 14.1941C9.59195 14.3546 9.27274 14.4382 8.94828 14.4365ZM8.92624 7.70169C8.87986 7.70153 8.83426 7.71356 8.794 7.73659C8.75032 7.76091 8.71407 7.79667 8.68916 7.84003C8.66425 7.88338 8.6516 7.9327 8.65259 7.98269V12.464C8.65275 12.5132 8.66575 12.5615 8.6903 12.6042C8.71485 12.6468 8.7501 12.6823 8.79258 12.7072C8.83505 12.732 8.88328 12.7454 8.93248 12.7459C8.98169 12.7464 9.03019 12.7341 9.07317 12.7101L13.5985 10.4474C13.6326 10.4212 13.6597 10.3871 13.6777 10.3481C13.6956 10.309 13.7037 10.2662 13.7014 10.2233C13.7026 10.1733 13.69 10.1239 13.6651 10.0805C13.6401 10.0371 13.6038 10.0014 13.56 9.97723L9.11908 7.75863C9.06358 7.72459 9.00044 7.70502 8.93542 7.70169H8.92624Z"
                                        fill="#929292"
                                        stroke="#929292"
                                        strokeWidth="0.2"
                                      />
                                    </svg>
                                  </span> {item.title}</h4>

                                </div>
                              )
                            })
                          }
                        </div>
                      </>
                    ) : (
                      <>
                        <h1 className="section-heading">
                          No Lecture Content Available
                        </h1>
                      </>
                    )}
                    <ul className="course-detail-list py-3">
                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="21"
                          viewBox="0 0 22 21"
                          fill="none"
                        >
                          <path
                            d="M17.077 20.3246H5.29346C4.17733 20.3236 3.1072 19.8798 2.31798 19.0906C1.52877 18.3014 1.08496 17.2313 1.08398 16.1151V4.33154C1.08496 3.21542 1.52877 2.14529 2.31798 1.35607C3.1072 0.566852 4.17733 0.123043 5.29346 0.12207L17.077 0.12207C18.1932 0.123043 19.2633 0.566852 20.0525 1.35607C20.8417 2.14529 21.2855 3.21542 21.2865 4.33154V16.1151C21.2855 17.2313 20.8417 18.3014 20.0525 19.0906C19.2633 19.8798 18.1932 20.3236 17.077 20.3246ZM5.29346 1.80623C4.6237 1.80623 3.98138 2.07229 3.50779 2.54587C3.0342 3.01946 2.76814 3.66179 2.76814 4.33154V16.1151C2.76814 16.7849 3.0342 17.4272 3.50779 17.9008C3.98138 18.3744 4.6237 18.6404 5.29346 18.6404H17.077C17.7468 18.6404 18.3891 18.3744 18.8627 17.9008C19.3363 17.4272 19.6024 16.7849 19.6024 16.1151V4.33154C19.6024 3.66179 19.3363 3.01946 18.8627 2.54587C18.3891 2.07229 17.7468 1.80623 17.077 1.80623H5.29346ZM8.94828 14.4365C8.59711 14.4355 8.25244 14.3417 7.94917 14.1647C7.64832 13.9944 7.39821 13.7472 7.22456 13.4483C7.0509 13.1494 6.95996 12.8097 6.96108 12.464V7.98269C6.96148 7.63877 7.05204 7.30096 7.22374 7.00297C7.39544 6.70497 7.64227 6.4572 7.93961 6.28437C8.23695 6.11155 8.57441 6.0197 8.91832 6.01799C9.26224 6.01629 9.60059 6.10479 9.89963 6.27466L14.3589 8.49326C14.6674 8.66005 14.9256 8.90627 15.107 9.20643C15.2883 9.50659 15.3861 9.84978 15.3902 10.2004C15.3944 10.5511 15.3047 10.8965 15.1304 11.2008C14.9562 11.5052 14.7038 11.7574 14.3993 11.9314L9.87392 14.1941C9.59195 14.3546 9.27274 14.4382 8.94828 14.4365ZM8.92624 7.70169C8.87986 7.70153 8.83426 7.71356 8.794 7.73659C8.75032 7.76091 8.71407 7.79667 8.68916 7.84003C8.66425 7.88338 8.6516 7.9327 8.65259 7.98269V12.464C8.65275 12.5132 8.66575 12.5615 8.6903 12.6042C8.71485 12.6468 8.7501 12.6823 8.79258 12.7072C8.83505 12.732 8.88328 12.7454 8.93248 12.7459C8.98169 12.7464 9.03019 12.7341 9.07317 12.7101L13.5985 10.4474C13.6326 10.4212 13.6597 10.3871 13.6777 10.3481C13.6956 10.309 13.7037 10.2662 13.7014 10.2233C13.7026 10.1733 13.69 10.1239 13.6651 10.0805C13.6401 10.0371 13.6038 10.0014 13.56 9.97723L9.11908 7.75863C9.06358 7.72459 9.00044 7.70502 8.93542 7.70169H8.92624Z"
                            fill="#929292"
                            stroke="#929292"
                            strokeWidth="0.2"
                          />
                        </svg>
                        {lectureData?.lectureMaster?.lectureName} - Lecture{" "}
                        {lectureData?.lectureMaster?.sequenceNo}
                      </li>

                      <li>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M10.3868 0.303703V0.303516L10.3369 0.303516L10.3368 0.303516C8.48025 0.303516 6.66536 0.856829 5.1217 1.89346C3.57804 2.93008 2.37494 4.40345 1.6645 6.12721C0.954065 7.85098 0.768187 9.74774 1.13036 11.5777C1.49253 13.4076 2.3865 15.0885 3.69926 16.4079C5.01201 17.7272 6.6846 18.6257 8.50551 18.9898C10.3264 19.3538 12.2139 19.1669 13.9291 18.4529C15.6444 17.7388 17.1104 16.5297 18.1418 14.9783C19.1732 13.4269 19.7237 11.603 19.7237 9.73727V9.73722C19.721 7.23616 18.7312 4.83826 16.9715 3.06966C15.2235 1.31289 12.8576 0.319569 10.3868 0.303703ZM10.3368 17.5071C8.80787 17.5071 7.31328 17.0514 6.04199 16.1977C4.77069 15.344 3.77979 14.1305 3.19464 12.7107C2.60949 11.291 2.45639 9.72866 2.7547 8.22141C3.05301 6.71417 3.78932 5.32972 4.8705 4.24311C5.95167 3.1565 7.32914 2.41654 8.82871 2.11676C10.3283 1.81698 11.8826 1.97084 13.2952 2.55888C14.7077 3.14693 15.9151 4.14277 16.7646 5.42051C17.6141 6.69824 18.0675 8.20046 18.0675 9.73722C18.0653 11.7973 17.25 13.7723 15.8007 15.2289C14.3514 16.6855 12.3863 17.5048 10.3368 17.5071Z"
                            fill="#929292"
                            stroke="#929292"
                            strokeWidth="0.1"
                          />
                          <path
                            d="M6.91038 10.8196C6.72372 10.9368 6.59109 11.1236 6.54159 11.339C6.49209 11.5544 6.52974 11.7807 6.64629 11.9682C6.76285 12.1557 6.94881 12.2891 7.1633 12.3389C7.37781 12.3887 7.60319 12.3508 7.78986 12.2336L7.78987 12.2336L11.116 9.6436H11.166V9.64335V5.82836C11.166 5.60779 11.0788 5.3962 10.9235 5.24015C10.7683 5.0841 10.5576 4.99639 10.3379 4.99639C10.1182 4.99639 9.90756 5.0841 9.75228 5.24015C9.59702 5.3962 9.50984 5.60779 9.50984 5.82836V9.18278L6.91038 10.8196ZM6.91038 10.8196L6.93696 10.8619L6.91032 10.8196L6.91038 10.8196Z"
                            fill="#929292"
                            stroke="#929292"
                            strokeWidth="0.1"
                          />
                        </svg>
                        {lectureData?.lectureMaster?.duration}
                      </li>
                    </ul>

                    <div>
                      <h4 className="course-title">About Lecture</h4>
                      <div className="section-content">
                        {lectureData?.lectureMaster?.lectureDescription}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  {
                    lectureData?.mcqList && lectureData?.mcqList.length > 0 ? (
                      <>
                        <div className="msq-list">
                          {currentQuestionIndex <=
                            lectureData?.mcqList?.length - 1 ? (
                            <>
                              {!hasAnswerOptionMaster ? (
                                <>
                                  <div className="msp-list-item">
                                    <h3 className="section-heading question-heading-img">
                                      {currentQuestionIndex + 1}/
                                      {lectureData?.mcqList?.length}.{" "}
                                      {
                                        lectureData?.mcqList[currentQuestionIndex]
                                          ?.question?.title
                                      }
                                    </h3>

                                    <div className="msp-ans-module">
                                      <ul className="msp-ans-list p-0 m-0">
                                        {lectureData?.mcqList[
                                          currentQuestionIndex
                                        ]?.options?.map((option, optionIndex) => (
                                          <label className="radio-label w-100">
                                            <li
                                              key={option.mcqOptionMasterId}
                                              className={`${selectedOption ===
                                                option.mcqOptionMasterId
                                                ? "selected"
                                                : ""
                                                }`}
                                            >
                                              <input
                                                type="radio"
                                                name="options"
                                                style={{ display: "none" }}
                                                value={option.mcqOptionMasterId}
                                                checked={
                                                  selectedOption ===
                                                  option.mcqOptionMasterId
                                                }
                                                onChange={() =>
                                                  handleOptionChange(
                                                    option.mcqOptionMasterId
                                                  )
                                                }
                                              />
                                              <span className="ms-2">
                                                {optionIndex + 1}.{" "}
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
                                                  lectureData,
                                                  currentQuestionIndex - 1
                                                )
                                              }
                                            >
                                              Previous
                                            </Link>
                                          </>
                                        )}
                                        {currentQuestionIndex <
                                          lectureData?.mcqList?.length && (
                                            <Link
                                              onClick={() =>
                                                handleOptionSubmit(
                                                  selectedOption,
                                                  lectureData?.mcqList[
                                                    currentQuestionIndex
                                                  ]?.studentLectureMCQMasterId
                                                )
                                              }
                                              className="active-btn"
                                            >
                                              SAVE / NEXT
                                            </Link>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="msp-list-item">
                                    <h3 className="section-heading question-heading-img">
                                      {currentQuestionIndex + 1}/
                                      {lectureData?.mcqList?.length}.{" "}
                                      {
                                        lectureData?.mcqList[currentQuestionIndex]
                                          ?.question?.title
                                      }
                                    </h3>

                                    <div className="msp-ans-module">
                                      <ul className="msp-ans-list p-0 m-0">
                                        {lectureData?.mcqList[
                                          currentQuestionIndex
                                        ]?.options?.map((option, optionIndex) => (
                                          <label className="radio-label w-100">
                                            <li
                                              key={option.mcqOptionMasterId}
                                              className={`${option.isActualAnswer
                                                ? "correct-ans"
                                                : lectureData?.mcqList[
                                                  currentQuestionIndex
                                                ]?.answerOptionMaster &&
                                                !lectureData?.mcqList[
                                                  currentQuestionIndex
                                                ]?.answerOptionMaster
                                                  .isActualAnswer &&
                                                lectureData?.mcqList[
                                                  currentQuestionIndex
                                                ]?.answerOptionMaster
                                                  .mcqOptionMasterId ==
                                                option.mcqOptionMasterId &&
                                                "wrong-ans"
                                                }`}
                                            >
                                              <span className="ms-2">
                                                {optionIndex + 1}.{" "}
                                                {option.option.title}
                                              </span>
                                            </li>
                                          </label>
                                        ))}
                                      </ul>

                                      <div className="btn-list">
                                        Quiz Already Given
                                        {currentQuestionIndex > 0 && (
                                          <>
                                            <Link
                                              onClick={() =>
                                                setCurrentMCQ(
                                                  lectureData,
                                                  currentQuestionIndex - 1
                                                )
                                              }
                                            >
                                              Previous
                                            </Link>
                                          </>
                                        )}
                                        {currentQuestionIndex <=
                                          lectureData?.mcqList?.length && (
                                            <Link
                                              onClick={() =>
                                                setCurrentMCQ(
                                                  lectureData,
                                                  currentQuestionIndex + 1
                                                )
                                              }
                                              className="active-btn"
                                            >
                                              NEXT
                                            </Link>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <h3 className="section-heading">
                                All Questions Have Been Completed.
                              </h3>

                              <div className="msq-result-list-item">
                                <div
                                  className={`msq-result-block course-analytics-block ${resultData?.marks >= 7
                                    ? "green-bg"
                                    : resultData?.marks > 3
                                      ? "yellow-bg"
                                      : "red-bg"
                                    }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="19"
                                    viewBox="0 0 14 19"
                                    fill="none"
                                  >
                                    <path
                                      d="M12.8605 2.4716L11.5725 1.15901C11.2122 0.790346 10.7836 0.498084 10.3115 0.299142C9.83941 0.100201 9.33326 -0.00146933 8.82233 1.60435e-05H3.88889C2.85787 0.0012731 1.86943 0.418714 1.14039 1.16077C0.411352 1.90283 0.001235 2.90892 0 3.95835V15.0417C0.001235 16.0911 0.411352 17.0972 1.14039 17.8392C1.86943 18.5813 2.85787 18.9987 3.88889 19H10.1111C11.1421 18.9987 12.1306 18.5813 12.8596 17.8392C13.5886 17.0972 13.9988 16.0911 14 15.0417V5.27014C14.0012 4.75016 13.9012 4.23509 13.7056 3.75472C13.51 3.27436 13.2228 2.83824 12.8605 2.4716ZM11.7608 3.59101C11.8711 3.70289 11.9699 3.82598 12.0555 3.95835H10.1111V1.97918C10.2409 2.06731 10.3621 2.16806 10.4728 2.28001L11.7608 3.59101ZM12.4444 15.0417C12.4444 15.6716 12.1986 16.2756 11.761 16.721C11.3234 17.1664 10.7299 17.4167 10.1111 17.4167H3.88889C3.27005 17.4167 2.67656 17.1664 2.23897 16.721C1.80139 16.2756 1.55555 15.6716 1.55555 15.0417V3.95835C1.55555 3.32846 1.80139 2.72437 2.23897 2.27897C2.67656 1.83357 3.27005 1.58335 3.88889 1.58335H8.55555V3.95835C8.55555 4.37827 8.71944 4.781 9.01116 5.07793C9.30288 5.37486 9.69854 5.54168 10.1111 5.54168H12.4444V15.0417ZM10.1111 7.12501C10.3174 7.12501 10.5152 7.20842 10.6611 7.35688C10.8069 7.50535 10.8889 7.70671 10.8889 7.91668C10.8889 8.12664 10.8069 8.328 10.6611 8.47647C10.5152 8.62493 10.3174 8.70834 10.1111 8.70834H3.88889C3.68261 8.70834 3.48478 8.62493 3.33891 8.47647C3.19305 8.328 3.11111 8.12664 3.11111 7.91668C3.11111 7.70671 3.19305 7.50535 3.33891 7.35688C3.48478 7.20842 3.68261 7.12501 3.88889 7.12501H10.1111ZM10.8889 11.0833C10.8889 11.2933 10.8069 11.4947 10.6611 11.6431C10.5152 11.7916 10.3174 11.875 10.1111 11.875H3.88889C3.68261 11.875 3.48478 11.7916 3.33891 11.6431C3.19305 11.4947 3.11111 11.2933 3.11111 11.0833C3.11111 10.8734 3.19305 10.672 3.33891 10.5235C3.48478 10.3751 3.68261 10.2917 3.88889 10.2917H10.1111C10.3174 10.2917 10.5152 10.3751 10.6611 10.5235C10.8069 10.672 10.8889 10.8734 10.8889 11.0833ZM10.7395 13.7853C10.8604 13.9546 10.9106 14.1657 10.8789 14.3725C10.8473 14.5794 10.7365 14.765 10.5708 14.8889C9.78273 15.4604 8.84939 15.7884 7.88277 15.8333C7.31801 15.8306 6.77041 15.6355 6.32722 15.2792C6.07211 15.101 5.97488 15.0417 5.78277 15.0417C5.26277 15.1236 4.77214 15.34 4.35788 15.6703C4.19358 15.7895 3.99018 15.839 3.79065 15.8085C3.59111 15.7779 3.41106 15.6696 3.28851 15.5064C3.16596 15.3433 3.1105 15.138 3.13386 14.934C3.15721 14.73 3.25754 14.5432 3.41366 14.4131C4.09903 13.8715 4.92199 13.5403 5.78588 13.4583C6.30399 13.4668 6.80487 13.649 7.21077 13.9769C7.39579 14.1463 7.63401 14.2431 7.88277 14.25C8.51874 14.2015 9.1303 13.9803 9.65377 13.6095C9.82068 13.4864 10.0288 13.4357 10.2324 13.4687C10.436 13.5016 10.6184 13.6155 10.7395 13.7853Z"
                                      fill="white"
                                    />
                                  </svg>

                                  <span>
                                    {resultData?.marks} / {resultData?.totalMarks}
                                  </span>
                                  <h4>Total MCQ Marks</h4>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="150"
                                    height="196"
                                    viewBox="0 0 150 196"
                                    fill="none"
                                    className="light-svg-icon"
                                  >
                                    <g opacity="0.25">
                                      <g clipPath="url(#clip0_727_19062)">
                                        <rect width="155" height="198" fill="" />
                                        <path
                                          d="M157.579 43.4226L143.153 29.3436C139.117 25.3892 134.322 22.262 129.047 20.1432C123.772 18.0244 118.121 16.956 112.421 16.9998L57.3839 17.2681C45.8821 17.3378 34.8736 21.8913 26.7732 29.93C18.6727 37.9687 14.1418 48.8362 14.1742 60.1486L14.6619 179.621C14.7219 190.934 19.3414 201.757 27.5071 209.716C35.6729 217.675 46.7181 222.121 58.2201 222.079L127.634 221.74C139.136 221.671 150.145 217.117 158.245 209.079C166.346 201.04 170.877 190.172 170.844 178.86L170.414 73.5275C170.405 67.9223 169.266 62.3756 167.063 57.2081C164.86 52.0407 161.637 47.3551 157.579 43.4226ZM145.36 55.5492C146.595 56.7492 147.703 58.0706 148.664 59.4928L126.972 59.5986L126.885 38.2641C128.338 39.2071 129.693 40.2865 130.933 41.4873L145.36 55.5492ZM153.491 178.945C153.518 185.734 150.802 192.26 145.94 197.085C141.078 201.91 134.468 204.639 127.565 204.673L58.1504 205.011C51.2467 205.045 44.6148 202.38 39.7136 197.603C34.8123 192.825 32.0432 186.327 32.0155 179.537L31.5278 60.064C31.5001 53.2741 34.2159 46.7489 39.078 41.9239C43.94 37.0989 50.5499 34.3694 57.4536 34.3357L109.514 34.0819L109.619 59.6832C109.637 64.2098 111.483 68.5421 114.751 71.727C118.018 74.9119 122.44 76.6886 127.042 76.6661L153.073 76.5392L153.491 178.945ZM127.112 93.7337C129.413 93.7225 131.624 94.6108 133.257 96.2033C134.891 97.7957 135.814 99.9619 135.823 102.225C135.833 104.488 134.927 106.664 133.307 108.272C131.686 109.88 129.483 110.79 127.181 110.801L57.7672 111.14C55.466 111.151 53.2553 110.263 51.6216 108.67C49.9878 107.078 49.0648 104.912 49.0556 102.648C49.0463 100.385 49.9516 98.2099 51.5723 96.6016C53.193 94.9932 55.3963 94.0834 57.6975 94.0721L127.112 93.7337ZM135.963 136.36C135.972 138.624 135.067 140.799 133.446 142.407C131.825 144.015 129.622 144.925 127.321 144.936L57.9065 145.275C55.6053 145.286 53.3947 144.398 51.7609 142.805C50.1272 141.213 49.2041 139.047 49.1949 136.783C49.1857 134.52 50.091 132.345 51.7116 130.737C53.3323 129.128 55.5356 128.218 57.8369 128.207L127.251 127.869C129.552 127.858 131.763 128.746 133.397 130.338C135.031 131.931 135.954 134.097 135.963 136.36ZM134.416 165.494C135.772 167.313 136.34 169.586 135.997 171.817C135.653 174.048 134.425 176.055 132.581 177.399C123.815 183.603 113.418 187.189 102.636 187.726C96.3355 187.727 90.218 185.654 85.2581 181.837C82.4043 179.931 81.3171 179.296 79.1739 179.307C73.3764 180.218 67.9125 182.578 63.3057 186.16C61.4779 187.454 59.211 188 56.9837 187.681C54.7564 187.362 52.7429 186.205 51.3686 184.452C49.9943 182.7 49.3666 180.491 49.6181 178.29C49.8697 176.09 50.9807 174.071 52.7167 172.66C60.3387 166.785 69.505 163.17 79.1389 162.239C84.9192 162.302 90.515 164.239 95.0576 167.751C97.1291 169.567 99.7909 170.598 102.566 170.659C109.659 170.102 116.472 167.684 122.295 163.659C124.152 162.322 126.471 161.765 128.744 162.109C131.017 162.453 133.057 163.671 134.416 165.494Z"
                                          fill="white"
                                        />
                                      </g>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_727_19062">
                                        <rect width="155" height="198" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
                              </div>

                              {resultData?.mcqList?.map((result, index) => (
                                <>
                                  <div className="msq-result-accordian-item">
                                    <div
                                      className="accordion accordion-flush"
                                      id={"accordionFlush${index}"}
                                    >
                                      <div
                                        className="accordion-item"
                                        key={result.studentLectureMCQMasterId}
                                      >
                                        <h2
                                          className={`accordion-header ${result.answerOptionMaster?.isActualAnswer
                                            ? "correct"
                                            : "wrong"
                                            }`}
                                          id={`flush-heading${index}`}
                                        >
                                          <span
                                            className="accordian-title"
                                            type="span"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#flush-collapse${index}`}
                                            aria-expanded="false"
                                            aria-controls={`flush-collapse${index}`}
                                          >
                                            {index + 1}. {result.question?.title}
                                          </span>
                                        </h2>
                                        <div
                                          id={`flush-collapse${index}`}
                                          className="accordion-collapse collapse"
                                          aria-labelledby={`flush-heading${index}`}
                                          data-bs-parent={"#accordionFlush${index}"}
                                        >
                                          <div className="accordion-body py-3 px-auto">
                                            {result?.options?.map((option, index) => (
                                              <>
                                                <ul className="mcq-ans-list">
                                                  <li
                                                    key={option.mcqOptionMasterId}
                                                    className={
                                                      option.isActualAnswer
                                                        ? "correct-ans"
                                                        : !result.answerOptionMaster
                                                          ?.isActualAnswer &&
                                                        result.answerOptionMaster
                                                          ?.mcqOptionMasterId ===
                                                        option.mcqOptionMasterId &&
                                                        "wrong-ans"
                                                    }
                                                  >
                                                    {index + 1}. {option.option.title}
                                                  </li>
                                                </ul>
                                              </>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </>
                          )}
                        </div>

                      </>
                    ) : (
                      <>
                        <div className="card-shadow mt-5 px-3">
                          <h3 className="section-heading m-0 mb-4">
                            No MCQ were Available For This Lecture
                          </h3>
                        </div>
                      </>
                    )
                  }
                </div>

                <div
                  className="tab-pane fade"
                  id="contact"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                >
                  <div className="card-shadow mt-5">
                    {lectureData?.assignmentList?.length > 0 && (
                      <>
                        <div className="card-shadow">
                          <h3 className="section-heading m-0 mb-4">
                            Test Your Knowledge
                          </h3>

                          <object
                            data={lectureData?.assignmentList[0]?.filePath}
                            width="100%"
                            height="500"
                            aria-label="pdf"
                          ></object>

                          <div className="btn-list mt-5">
                            <Link
                              className="active-btn"
                              onClick={(e) =>
                                handleFileDownload(
                                  e,
                                  lectureData?.assignmentList[0]?.filePath,
                                  lectureData?.assignmentList[0]?.fileName
                                )
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="43"
                                height="39"
                                viewBox="0 0 43 39"
                                fill="none"
                              >
                                <path
                                  d="M26.6489 38.1498C25.9533 38.1511 25.2642 38.0229 24.6208 37.7727C23.9786 37.5228 23.3944 37.156 22.9017 36.6929L20.2682 34.4848L20.3645 34.3698L20.2681 34.4848C20.0856 34.3317 19.9364 34.1458 19.8293 33.9374C19.7223 33.729 19.6597 33.5023 19.6454 33.2704C19.6165 32.8016 19.7866 32.3429 20.1155 31.9948C20.444 31.6472 20.9038 31.4383 21.393 31.4116C21.6354 31.3983 21.8783 31.4301 22.108 31.5054C22.3376 31.5806 22.5499 31.6979 22.7323 31.851L22.7326 31.8512L24.7659 33.5646V21.9094C24.7659 21.4399 24.9639 20.9916 25.3132 20.6624C25.6622 20.3336 26.1338 20.1503 26.6237 20.1503C27.1136 20.1503 27.5852 20.3336 27.9342 20.6624C28.2835 20.9916 28.4815 21.4399 28.4815 21.9094V33.5665L30.5149 31.856L30.5151 31.8558C30.8831 31.5472 31.3643 31.3899 31.8531 31.4163C32.3418 31.4428 32.8014 31.6509 33.1301 31.9979C33.2933 32.1701 33.4193 32.3713 33.5004 32.5904C33.5816 32.8096 33.6162 33.0419 33.6021 33.274C33.588 33.5061 33.5254 33.733 33.4184 33.9417C33.3113 34.1503 33.1619 34.3364 32.9793 34.4896M26.6489 38.1498C26.6486 38.1498 26.6484 38.1498 26.6482 38.1498L26.6493 37.9998L26.6496 38.1498C26.6494 38.1498 26.6491 38.1498 26.6489 38.1498ZM26.6489 38.1498C27.3202 38.1549 27.9862 38.0349 28.6085 37.7966C29.2299 37.5586 29.7958 37.2073 30.2737 36.7622M30.2737 36.7622L32.9793 34.4896M30.2737 36.7622C30.2747 36.7613 30.2756 36.7604 30.2766 36.7595L30.1743 36.6499M30.2737 36.7622L30.2707 36.7647L30.1743 36.6499M32.9793 34.4896L32.9794 34.4895L32.8829 34.3747M32.9793 34.4896L32.8829 34.3747M32.8829 34.3747L30.1743 36.6499M32.8829 34.3747L30.1743 36.6499M5.82644 19.6705C4.13757 20.527 2.76249 21.8489 1.8871 23.463C0.986895 25.1229 0.660845 27.0076 0.955583 28.852L0.955398 28.852L0.956951 28.8593C1.40963 30.9993 2.62525 32.9271 4.39962 34.3237C6.17383 35.7202 8.40038 36.5019 10.7094 36.5408H10.7119H14.6689C15.1589 36.5408 15.6304 36.3575 15.9794 36.0287C16.3287 35.6996 16.5268 35.2513 16.5268 34.7818C16.5268 34.3122 16.3287 33.8639 15.9794 33.5348C15.6304 33.206 15.1589 33.0227 14.6689 33.0227H10.7132C9.28652 32.9966 7.91157 32.5197 6.80886 31.67C5.70739 30.8212 4.94181 29.6501 4.63243 28.3454C4.45378 27.2273 4.65044 26.0842 5.19579 25.0757C5.7421 24.0653 6.61141 23.2399 7.68314 22.7168L7.68316 22.7168L7.68662 22.715C8.50351 22.2897 9.11243 21.5768 9.37836 20.7285C9.64434 19.88 9.54482 18.9671 9.10238 18.1882C8.44999 17.0157 8.0651 15.7281 7.972 14.4081C7.87889 13.0878 8.07968 11.7636 8.56172 10.5203C9.04378 9.27696 9.7966 8.14161 10.7725 7.18734C11.7483 6.23305 12.9257 5.48097 14.2293 4.97982C15.5328 4.47866 16.9335 4.23965 18.3413 4.27833C19.7491 4.317 21.1325 4.63249 22.4028 5.20429C23.673 5.77608 24.8016 6.59141 25.7167 7.59749C26.6317 8.60353 27.313 9.7781 27.7173 11.0456L27.7175 11.0465C27.9782 11.8476 28.4424 12.5758 29.0688 13.168C29.6952 13.7601 30.4648 14.1985 31.3106 14.4458L31.3113 14.446C33.5111 15.0767 35.4131 16.3981 36.7017 18.188C37.99 19.9776 38.5877 22.128 38.3966 24.2807L38.3964 24.2827C38.2702 25.9536 37.6222 27.553 36.5327 28.8795L36.5324 28.8799C36.2306 29.2498 36.096 29.7193 36.1607 30.1848C36.2253 30.6502 36.4832 31.0698 36.874 31.3529C37.2646 31.6357 37.7569 31.7599 38.2429 31.7C38.7289 31.6401 39.172 31.4005 39.4735 31.031L39.4736 31.0308C40.9968 29.1597 41.9107 26.9107 42.1026 24.5574C42.3636 21.6018 41.5412 18.652 39.7741 16.2001C38.0072 13.7483 35.4029 11.9429 32.3968 11.0828C32.1263 11.0036 31.8817 10.8628 31.6845 10.6736C31.4872 10.4844 31.3435 10.2528 31.2654 10L31.2655 10L31.2645 9.99721C30.3492 7.22855 28.4804 4.82856 25.956 3.17595C23.4318 1.52343 20.3957 0.712081 17.3284 0.869182C14.261 1.02628 11.3358 2.14297 9.01606 4.04397C6.69627 5.94503 5.11432 8.52222 4.52282 11.3684C3.92655 14.1967 4.38866 17.1302 5.82644 19.6705Z"
                                  fill="white"
                                  stroke="white"
                                  strokeWidth="0.3"
                                />
                              </svg>{" "}
                              Download Assignment
                            </Link>

                            {lectureData?.assignmentList[0].uploadedAssignment
                              .filePath ? (
                              <>
                                <Link
                                  className="active-btn"
                                  onClick={(e) =>
                                    handleFileDownload(
                                      e,
                                      lectureData?.assignmentList[0]
                                        ?.uploadedAssignment.filePath,
                                      lectureData?.assignmentList[0]
                                        ?.uploadedAssignment.documentName
                                    )
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="43"
                                    height="39"
                                    viewBox="0 0 43 39"
                                    fill="none"
                                  >
                                    <path
                                      d="M26.6489 38.1498C25.9533 38.1511 25.2642 38.0229 24.6208 37.7727C23.9786 37.5228 23.3944 37.156 22.9017 36.6929L20.2682 34.4848L20.3645 34.3698L20.2681 34.4848C20.0856 34.3317 19.9364 34.1458 19.8293 33.9374C19.7223 33.729 19.6597 33.5023 19.6454 33.2704C19.6165 32.8016 19.7866 32.3429 20.1155 31.9948C20.444 31.6472 20.9038 31.4383 21.393 31.4116C21.6354 31.3983 21.8783 31.4301 22.108 31.5054C22.3376 31.5806 22.5499 31.6979 22.7323 31.851L22.7326 31.8512L24.7659 33.5646V21.9094C24.7659 21.4399 24.9639 20.9916 25.3132 20.6624C25.6622 20.3336 26.1338 20.1503 26.6237 20.1503C27.1136 20.1503 27.5852 20.3336 27.9342 20.6624C28.2835 20.9916 28.4815 21.4399 28.4815 21.9094V33.5665L30.5149 31.856L30.5151 31.8558C30.8831 31.5472 31.3643 31.3899 31.8531 31.4163C32.3418 31.4428 32.8014 31.6509 33.1301 31.9979C33.2933 32.1701 33.4193 32.3713 33.5004 32.5904C33.5816 32.8096 33.6162 33.0419 33.6021 33.274C33.588 33.5061 33.5254 33.733 33.4184 33.9417C33.3113 34.1503 33.1619 34.3364 32.9793 34.4896M26.6489 38.1498C26.6486 38.1498 26.6484 38.1498 26.6482 38.1498L26.6493 37.9998L26.6496 38.1498C26.6494 38.1498 26.6491 38.1498 26.6489 38.1498ZM26.6489 38.1498C27.3202 38.1549 27.9862 38.0349 28.6085 37.7966C29.2299 37.5586 29.7958 37.2073 30.2737 36.7622M30.2737 36.7622L32.9793 34.4896M30.2737 36.7622C30.2747 36.7613 30.2756 36.7604 30.2766 36.7595L30.1743 36.6499M30.2737 36.7622L30.2707 36.7647L30.1743 36.6499M32.9793 34.4896L32.9794 34.4895L32.8829 34.3747M32.9793 34.4896L32.8829 34.3747M32.8829 34.3747L30.1743 36.6499M32.8829 34.3747L30.1743 36.6499M5.82644 19.6705C4.13757 20.527 2.76249 21.8489 1.8871 23.463C0.986895 25.1229 0.660845 27.0076 0.955583 28.852L0.955398 28.852L0.956951 28.8593C1.40963 30.9993 2.62525 32.9271 4.39962 34.3237C6.17383 35.7202 8.40038 36.5019 10.7094 36.5408H10.7119H14.6689C15.1589 36.5408 15.6304 36.3575 15.9794 36.0287C16.3287 35.6996 16.5268 35.2513 16.5268 34.7818C16.5268 34.3122 16.3287 33.8639 15.9794 33.5348C15.6304 33.206 15.1589 33.0227 14.6689 33.0227H10.7132C9.28652 32.9966 7.91157 32.5197 6.80886 31.67C5.70739 30.8212 4.94181 29.6501 4.63243 28.3454C4.45378 27.2273 4.65044 26.0842 5.19579 25.0757C5.7421 24.0653 6.61141 23.2399 7.68314 22.7168L7.68316 22.7168L7.68662 22.715C8.50351 22.2897 9.11243 21.5768 9.37836 20.7285C9.64434 19.88 9.54482 18.9671 9.10238 18.1882C8.44999 17.0157 8.0651 15.7281 7.972 14.4081C7.87889 13.0878 8.07968 11.7636 8.56172 10.5203C9.04378 9.27696 9.7966 8.14161 10.7725 7.18734C11.7483 6.23305 12.9257 5.48097 14.2293 4.97982C15.5328 4.47866 16.9335 4.23965 18.3413 4.27833C19.7491 4.317 21.1325 4.63249 22.4028 5.20429C23.673 5.77608 24.8016 6.59141 25.7167 7.59749C26.6317 8.60353 27.313 9.7781 27.7173 11.0456L27.7175 11.0465C27.9782 11.8476 28.4424 12.5758 29.0688 13.168C29.6952 13.7601 30.4648 14.1985 31.3106 14.4458L31.3113 14.446C33.5111 15.0767 35.4131 16.3981 36.7017 18.188C37.99 19.9776 38.5877 22.128 38.3966 24.2807L38.3964 24.2827C38.2702 25.9536 37.6222 27.553 36.5327 28.8795L36.5324 28.8799C36.2306 29.2498 36.096 29.7193 36.1607 30.1848C36.2253 30.6502 36.4832 31.0698 36.874 31.3529C37.2646 31.6357 37.7569 31.7599 38.2429 31.7C38.7289 31.6401 39.172 31.4005 39.4735 31.031L39.4736 31.0308C40.9968 29.1597 41.9107 26.9107 42.1026 24.5574C42.3636 21.6018 41.5412 18.652 39.7741 16.2001C38.0072 13.7483 35.4029 11.9429 32.3968 11.0828C32.1263 11.0036 31.8817 10.8628 31.6845 10.6736C31.4872 10.4844 31.3435 10.2528 31.2654 10L31.2655 10L31.2645 9.99721C30.3492 7.22855 28.4804 4.82856 25.956 3.17595C23.4318 1.52343 20.3957 0.712081 17.3284 0.869182C14.261 1.02628 11.3358 2.14297 9.01606 4.04397C6.69627 5.94503 5.11432 8.52222 4.52282 11.3684C3.92655 14.1967 4.38866 17.1302 5.82644 19.6705Z"
                                      fill="white"
                                      stroke="white"
                                      strokeWidth="0.3"
                                    />
                                  </svg>
                                  Download Your Submitted Assignment
                                </Link>
                              </>
                            ) : (
                              <>
                                {(hideFileSelected && lectureData.attendanceCount > 0) && (
                                  <>
                                    <input
                                      className="active-btn"
                                      type="file"
                                      onChange={handleFileSelect}
                                      placeholder="Upload Selected Assignment"
                                    />
                                  </>
                                )}
                                {fileSelected && (
                                  <>
                                    <Link
                                      className="active-btn"
                                      onClick={(e) =>
                                        handleUploadFile(
                                          e,
                                          lectureData?.assignmentList[0]
                                            .studentLectureContentMasterId
                                        )
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="43"
                                        height="39"
                                        viewBox="0 0 43 39"
                                        fill="none"
                                      >
                                        <path
                                          d="M26.6489 38.1498C25.9533 38.1511 25.2642 38.0229 24.6208 37.7727C23.9786 37.5228 23.3944 37.156 22.9017 36.6929L20.2682 34.4848L20.3645 34.3698L20.2681 34.4848C20.0856 34.3317 19.9364 34.1458 19.8293 33.9374C19.7223 33.729 19.6597 33.5023 19.6454 33.2704C19.6165 32.8016 19.7866 32.3429 20.1155 31.9948C20.444 31.6472 20.9038 31.4383 21.393 31.4116C21.6354 31.3983 21.8783 31.4301 22.108 31.5054C22.3376 31.5806 22.5499 31.6979 22.7323 31.851L22.7326 31.8512L24.7659 33.5646V21.9094C24.7659 21.4399 24.9639 20.9916 25.3132 20.6624C25.6622 20.3336 26.1338 20.1503 26.6237 20.1503C27.1136 20.1503 27.5852 20.3336 27.9342 20.6624C28.2835 20.9916 28.4815 21.4399 28.4815 21.9094V33.5665L30.5149 31.856L30.5151 31.8558C30.8831 31.5472 31.3643 31.3899 31.8531 31.4163C32.3418 31.4428 32.8014 31.6509 33.1301 31.9979C33.2933 32.1701 33.4193 32.3713 33.5004 32.5904C33.5816 32.8096 33.6162 33.0419 33.6021 33.274C33.588 33.5061 33.5254 33.733 33.4184 33.9417C33.3113 34.1503 33.1619 34.3364 32.9793 34.4896M26.6489 38.1498C26.6486 38.1498 26.6484 38.1498 26.6482 38.1498L26.6493 37.9998L26.6496 38.1498C26.6494 38.1498 26.6491 38.1498 26.6489 38.1498ZM26.6489 38.1498C27.3202 38.1549 27.9862 38.0349 28.6085 37.7966C29.2299 37.5586 29.7958 37.2073 30.2737 36.7622M30.2737 36.7622L32.9793 34.4896M30.2737 36.7622C30.2747 36.7613 30.2756 36.7604 30.2766 36.7595L30.1743 36.6499M30.2737 36.7622L30.2707 36.7647L30.1743 36.6499M32.9793 34.4896L32.9794 34.4895L32.8829 34.3747M32.9793 34.4896L32.8829 34.3747M32.8829 34.3747L30.1743 36.6499M32.8829 34.3747L30.1743 36.6499M5.82644 19.6705C4.13757 20.527 2.76249 21.8489 1.8871 23.463C0.986895 25.1229 0.660845 27.0076 0.955583 28.852L0.955398 28.852L0.956951 28.8593C1.40963 30.9993 2.62525 32.9271 4.39962 34.3237C6.17383 35.7202 8.40038 36.5019 10.7094 36.5408H10.7119H14.6689C15.1589 36.5408 15.6304 36.3575 15.9794 36.0287C16.3287 35.6996 16.5268 35.2513 16.5268 34.7818C16.5268 34.3122 16.3287 33.8639 15.9794 33.5348C15.6304 33.206 15.1589 33.0227 14.6689 33.0227H10.7132C9.28652 32.9966 7.91157 32.5197 6.80886 31.67C5.70739 30.8212 4.94181 29.6501 4.63243 28.3454C4.45378 27.2273 4.65044 26.0842 5.19579 25.0757C5.7421 24.0653 6.61141 23.2399 7.68314 22.7168L7.68316 22.7168L7.68662 22.715C8.50351 22.2897 9.11243 21.5768 9.37836 20.7285C9.64434 19.88 9.54482 18.9671 9.10238 18.1882C8.44999 17.0157 8.0651 15.7281 7.972 14.4081C7.87889 13.0878 8.07968 11.7636 8.56172 10.5203C9.04378 9.27696 9.7966 8.14161 10.7725 7.18734C11.7483 6.23305 12.9257 5.48097 14.2293 4.97982C15.5328 4.47866 16.9335 4.23965 18.3413 4.27833C19.7491 4.317 21.1325 4.63249 22.4028 5.20429C23.673 5.77608 24.8016 6.59141 25.7167 7.59749C26.6317 8.60353 27.313 9.7781 27.7173 11.0456L27.7175 11.0465C27.9782 11.8476 28.4424 12.5758 29.0688 13.168C29.6952 13.7601 30.4648 14.1985 31.3106 14.4458L31.3113 14.446C33.5111 15.0767 35.4131 16.3981 36.7017 18.188C37.99 19.9776 38.5877 22.128 38.3966 24.2807L38.3964 24.2827C38.2702 25.9536 37.6222 27.553 36.5327 28.8795L36.5324 28.8799C36.2306 29.2498 36.096 29.7193 36.1607 30.1848C36.2253 30.6502 36.4832 31.0698 36.874 31.3529C37.2646 31.6357 37.7569 31.7599 38.2429 31.7C38.7289 31.6401 39.172 31.4005 39.4735 31.031L39.4736 31.0308C40.9968 29.1597 41.9107 26.9107 42.1026 24.5574C42.3636 21.6018 41.5412 18.652 39.7741 16.2001C38.0072 13.7483 35.4029 11.9429 32.3968 11.0828C32.1263 11.0036 31.8817 10.8628 31.6845 10.6736C31.4872 10.4844 31.3435 10.2528 31.2654 10L31.2655 10L31.2645 9.99721C30.3492 7.22855 28.4804 4.82856 25.956 3.17595C23.4318 1.52343 20.3957 0.712081 17.3284 0.869182C14.261 1.02628 11.3358 2.14297 9.01606 4.04397C6.69627 5.94503 5.11432 8.52222 4.52282 11.3684C3.92655 14.1967 4.38866 17.1302 5.82644 19.6705Z"
                                          fill="white"
                                          stroke="white"
                                          strokeWidth="0.3"
                                        />
                                      </svg>
                                      Upload Selected Assignment
                                    </Link>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="notes"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                >
                  <div className="card-shadow mt-5 px-3">
                    {lectureData?.notesList?.length > 0 ? (
                      <>
                        <div className="card-shadow">
                          <h3 className="section-heading m-0 mb-4">
                            Download Notes
                          </h3>
                          <object
                            data={lectureData?.notesList[0]?.filePath}
                            width="100%"
                            height="500"
                            aria-label="pdf"
                          ></object>
                          <div className="btn-list mt-5">
                            <Link
                              className="active-btn"
                              onClick={(e) =>
                                handleFileDownload(
                                  e,
                                  lectureData?.notesList[0]?.filePath,
                                  lectureData?.notesList[0]?.fileName
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="43"
                                height="39"
                                viewBox="0 0 43 39"
                                fill="none"
                              >
                                <path
                                  d="M26.6489 38.1498C25.9533 38.1511 25.2642 38.0229 24.6208 37.7727C23.9786 37.5228 23.3944 37.156 22.9017 36.6929L20.2682 34.4848L20.3645 34.3698L20.2681 34.4848C20.0856 34.3317 19.9364 34.1458 19.8293 33.9374C19.7223 33.729 19.6597 33.5023 19.6454 33.2704C19.6165 32.8016 19.7866 32.3429 20.1155 31.9948C20.444 31.6472 20.9038 31.4383 21.393 31.4116C21.6354 31.3983 21.8783 31.4301 22.108 31.5054C22.3376 31.5806 22.5499 31.6979 22.7323 31.851L22.7326 31.8512L24.7659 33.5646V21.9094C24.7659 21.4399 24.9639 20.9916 25.3132 20.6624C25.6622 20.3336 26.1338 20.1503 26.6237 20.1503C27.1136 20.1503 27.5852 20.3336 27.9342 20.6624C28.2835 20.9916 28.4815 21.4399 28.4815 21.9094V33.5665L30.5149 31.856L30.5151 31.8558C30.8831 31.5472 31.3643 31.3899 31.8531 31.4163C32.3418 31.4428 32.8014 31.6509 33.1301 31.9979C33.2933 32.1701 33.4193 32.3713 33.5004 32.5904C33.5816 32.8096 33.6162 33.0419 33.6021 33.274C33.588 33.5061 33.5254 33.733 33.4184 33.9417C33.3113 34.1503 33.1619 34.3364 32.9793 34.4896M26.6489 38.1498C26.6486 38.1498 26.6484 38.1498 26.6482 38.1498L26.6493 37.9998L26.6496 38.1498C26.6494 38.1498 26.6491 38.1498 26.6489 38.1498ZM26.6489 38.1498C27.3202 38.1549 27.9862 38.0349 28.6085 37.7966C29.2299 37.5586 29.7958 37.2073 30.2737 36.7622M30.2737 36.7622L32.9793 34.4896M30.2737 36.7622C30.2747 36.7613 30.2756 36.7604 30.2766 36.7595L30.1743 36.6499M30.2737 36.7622L30.2707 36.7647L30.1743 36.6499M32.9793 34.4896L32.9794 34.4895L32.8829 34.3747M32.9793 34.4896L32.8829 34.3747M32.8829 34.3747L30.1743 36.6499M32.8829 34.3747L30.1743 36.6499M5.82644 19.6705C4.13757 20.527 2.76249 21.8489 1.8871 23.463C0.986895 25.1229 0.660845 27.0076 0.955583 28.852L0.955398 28.852L0.956951 28.8593C1.40963 30.9993 2.62525 32.9271 4.39962 34.3237C6.17383 35.7202 8.40038 36.5019 10.7094 36.5408H10.7119H14.6689C15.1589 36.5408 15.6304 36.3575 15.9794 36.0287C16.3287 35.6996 16.5268 35.2513 16.5268 34.7818C16.5268 34.3122 16.3287 33.8639 15.9794 33.5348C15.6304 33.206 15.1589 33.0227 14.6689 33.0227H10.7132C9.28652 32.9966 7.91157 32.5197 6.80886 31.67C5.70739 30.8212 4.94181 29.6501 4.63243 28.3454C4.45378 27.2273 4.65044 26.0842 5.19579 25.0757C5.7421 24.0653 6.61141 23.2399 7.68314 22.7168L7.68316 22.7168L7.68662 22.715C8.50351 22.2897 9.11243 21.5768 9.37836 20.7285C9.64434 19.88 9.54482 18.9671 9.10238 18.1882C8.44999 17.0157 8.0651 15.7281 7.972 14.4081C7.87889 13.0878 8.07968 11.7636 8.56172 10.5203C9.04378 9.27696 9.7966 8.14161 10.7725 7.18734C11.7483 6.23305 12.9257 5.48097 14.2293 4.97982C15.5328 4.47866 16.9335 4.23965 18.3413 4.27833C19.7491 4.317 21.1325 4.63249 22.4028 5.20429C23.673 5.77608 24.8016 6.59141 25.7167 7.59749C26.6317 8.60353 27.313 9.7781 27.7173 11.0456L27.7175 11.0465C27.9782 11.8476 28.4424 12.5758 29.0688 13.168C29.6952 13.7601 30.4648 14.1985 31.3106 14.4458L31.3113 14.446C33.5111 15.0767 35.4131 16.3981 36.7017 18.188C37.99 19.9776 38.5877 22.128 38.3966 24.2807L38.3964 24.2827C38.2702 25.9536 37.6222 27.553 36.5327 28.8795L36.5324 28.8799C36.2306 29.2498 36.096 29.7193 36.1607 30.1848C36.2253 30.6502 36.4832 31.0698 36.874 31.3529C37.2646 31.6357 37.7569 31.7599 38.2429 31.7C38.7289 31.6401 39.172 31.4005 39.4735 31.031L39.4736 31.0308C40.9968 29.1597 41.9107 26.9107 42.1026 24.5574C42.3636 21.6018 41.5412 18.652 39.7741 16.2001C38.0072 13.7483 35.4029 11.9429 32.3968 11.0828C32.1263 11.0036 31.8817 10.8628 31.6845 10.6736C31.4872 10.4844 31.3435 10.2528 31.2654 10L31.2655 10L31.2645 9.99721C30.3492 7.22855 28.4804 4.82856 25.956 3.17595C23.4318 1.52343 20.3957 0.712081 17.3284 0.869182C14.261 1.02628 11.3358 2.14297 9.01606 4.04397C6.69627 5.94503 5.11432 8.52222 4.52282 11.3684C3.92655 14.1967 4.38866 17.1302 5.82644 19.6705Z"
                                  fill="white"
                                  stroke="white"
                                  strokeWidth="0.3"
                                />
                              </svg>{" "}
                              Download Notes
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="section-heading m-0 mb-4">
                          No Notes Are Available For This Lecture
                        </h3>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LectureDetails;
