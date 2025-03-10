import React, { useEffect, useContext, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Slider from "react-slick";
import axios from "../helper/axios";
import { AuthContext } from "../context/AuthContext";
import FormatPrice from "../helper/FormatPrice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-bootstrap/Modal";
import StarRatings from "react-star-ratings";
import Footer from "./Footer";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  arraow: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        slidesToShow: 1,
      },
    },
  ],
};

const BuyNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    courseBannerImage: {
      documentName: "",
      filePath: "",
      fileType: "",
    },
    highlightList: [],
    lectureMasterList: [{}],
  });
  const { token } = useContext(AuthContext);

  const [showAll, setShowAll] = useState(false);

  const handleShowMoreClick = () => {
    setShowAll(true);
  };
  const handleShowLessClick = () => {
    setShowAll(false);
  };

  useEffect(() => {
    if (token) {
      fetchCourseDataWithToken();
    } else {
      fetchCourseDataWithoutToken();
    }
  }, [token]);

  const fetchCourseDataWithToken = async () => {
    try {
      const response = await axios.get(`course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourseData(response.data.data);
    } catch (error) {
      console.error("Error Fetching Course Data", error);
    }
  };

  const fetchCourseDataWithoutToken = async () => {
    try {
      const response = await axios.get(`course/${id}`);
      setCourseData(response.data.data);
    } catch (error) {
      console.error("Error Fetching Course Data", error);
    }
  };

  // console.log("token", token);
  // const [paymentData, setPaymentData] = useState([]);

  // const handlePayment = async (e) => {
  //   e.preventDefault();
  //   // console.log("Payment", courseData.offeredPrice);
  //   if (!token) {
  //     navigate("/login");
  //   } else {
  //     try {
  //       const response = await axios.post(
  //         "enroll/pay",
  //         {
  //           courseMasterList: [
  //             {
  //               courseMasterId: id,
  //               offeredPrice: courseData.actualPrice,
  //             },
  //           ],
  //           price: courseData.offeredPrice,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       console.log("Response", response.data);
  //       setPaymentData(response.data);
  //       window.open(paymentData?.data?.paymentUrl);
  //       // navigate("/dashboard");
  //     } catch (error) {
  //       console.log("Error In Payment", error);
  //     }
  //   }
  // };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  let orderId;
  let paymentWindow;

  const handlePayment = async () => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        const response = await axios.post(
          "enroll/pay",
          {
            courseMasterList: [
              {
                courseMasterId: id,
                offeredPrice: courseData.offeredPrice,
              },
            ],
            price: courseData.offeredPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { paymentUrl } = response.data.data;
        orderId = response.data.data.orderId;
        // console.log("responseData", response.data.data);

        paymentWindow = window.open(
          paymentUrl,
          "Payment Window",
          "width=1000,height=1000"
        );

        const checkPaymentStatus = async () => {
          try {
            const checkStatusResponse = await axios.post(
              "payment/paymentStatus",
              {
                orderId: orderId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const { orderStatus } = checkStatusResponse.data.data;
            // console.log("orderstatus", checkStatusResponse.data.data);

            // console.log("orderStatus & id", orderStatus, orderId);

            if (orderStatus === "SUCCESS") {
              console.log("Payment Success");
              setShowSuccessModal(true);
            } else if (orderStatus === "FAILED") {
              console.log("Payment failed");
              setShowFailureModal(true);
            } else if (orderStatus === "ACTIVE") {
              console.log("Payment Active");
            }
          } catch (error) {
            console.error("Error checking payment status", error);
          }
        };

        const checkWindowStatus = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkWindowStatus);
            checkPaymentStatus();
          }
        }, 1000);
      } catch (error) {
        console.error("Error In Payment", error);
        setShowFailureModal(true);
      }
    }
  };

  const navigateToDashboard = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  const handleRetryPayment = () => {
    setShowFailureModal(false);
    handlePayment();
  };

  const handleNavigatetoCourse = () => {
    navigate(
      `/enrolled-courses-details/${courseData?.enrollCourseContainMasterId}`
    );
  };

  // console.log("courseData", courseData);

  return (
    <>
      <Navbar />

      <section className="courses-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="banner-content black-overlay position-relative">
                <img
                  src={courseData?.courseBannerImage?.filePath}
                  className="w-100"
                  alt={courseData?.documentName}
                />

                <div className="banner-data">
                  <h3>{courseData?.courseName}</h3>
                  <p>{courseData?.courseTagLine}</p>

                  <div className="banner-badge-module">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="23"
                        viewBox="0 0 24 23"
                        fill="none"
                      >
                        <path
                          d="M20.6653 10.4774H20.6663C20.8278 10.353 20.9478 10.1838 21.0106 9.99143C21.0767 9.78919 21.0762 9.57158 21.0093 9.36959C20.9424 9.1676 20.8124 8.99135 20.6375 8.86621C20.4627 8.74105 20.252 8.67347 20.0356 8.67332H15.3598C15.1449 8.67331 14.9353 8.60606 14.7614 8.48103C14.5874 8.35599 14.4579 8.17956 14.3919 7.97697L14.3919 7.97692L12.9708 3.61002L20.6653 10.4774ZM20.6653 10.4774L20.6391 10.4963M20.6653 10.4774L20.6391 10.4963M20.6391 10.4963L16.8399 13.2343C16.6668 13.3588 16.5378 13.5341 16.4715 13.7356C16.4052 13.937 16.4052 14.154 16.4713 14.3554C16.4713 14.3554 16.4713 14.3555 16.4714 14.3555L17.9153 18.7576L20.6391 10.4963ZM12.5955 17.1676L12.5956 17.1676L16.3317 19.8795C16.3317 19.8795 16.3317 19.8795 16.3317 19.8795C16.5063 20.0062 16.7174 20.0751 16.9345 20.0762C17.1517 20.0773 17.3634 20.0105 17.5394 19.8855C17.7153 19.7606 17.8463 19.5841 17.9137 19.3815C17.9812 19.1789 17.9817 18.9606 17.9153 18.7577L12.5955 17.1676ZM12.5955 17.1676C12.421 17.0412 12.2103 16.9731 11.9941 16.9731C11.7779 16.9731 11.5672 17.0412 11.3927 17.1676L11.3926 17.1676M12.5955 17.1676L11.3926 17.1676M11.3926 17.1676L7.65651 19.8795L7.65599 19.8799M11.3926 17.1676L7.65599 19.8799M7.65599 19.8799C7.48147 20.0083 7.26982 20.0787 7.05173 20.0806C6.83364 20.0826 6.62073 20.016 6.44386 19.8907C6.26701 19.7654 6.13546 19.5881 6.06801 19.3845C6.00056 19.1809 6.00062 18.9615 6.06818 18.758L6.06826 18.7578M7.65599 19.8799L6.06826 18.7578M6.06826 18.7578L7.51686 14.3555L7.51687 14.3555M6.06826 18.7578L7.51687 14.3555M7.51687 14.3555C7.58306 14.154 7.58301 13.937 7.51673 13.7356M7.51687 14.3555L7.51673 13.7356M9.59817 7.97692L9.59815 7.97697C9.53211 8.17956 9.40264 8.35599 9.22868 8.48103C9.05473 8.60606 8.8452 8.67331 8.63025 8.67332H3.95447C3.73807 8.67347 3.52739 8.74105 3.35253 8.86621C3.17768 8.99135 3.04766 9.1676 2.98075 9.36959C2.91385 9.57158 2.9134 9.78919 2.97946 9.99143C3.04553 10.1937 3.1748 10.3704 3.34908 10.4963L9.59817 7.97692ZM9.59817 7.97692L11.0192 3.61002L9.59817 7.97692ZM7.51673 13.7356C7.45047 13.5342 7.32148 13.3588 7.14844 13.2343L7.51673 13.7356ZM11.3909 3.10359C11.2156 3.22953 11.0856 3.40687 11.0193 3.60993L11.3909 3.10359ZM11.3909 3.10359C11.5662 2.97762 11.7778 2.90964 11.995 2.90964M11.3909 3.10359L11.995 2.90964M11.995 2.90964C12.2123 2.90964 12.4238 2.97762 12.5992 3.10359M11.995 2.90964L12.5992 3.10359M12.5992 3.10359C12.7745 3.22953 12.9045 3.40687 12.9708 3.60993L12.5992 3.10359ZM3.95441 6.66542H3.95427C3.30984 6.66632 2.68205 6.86798 2.16056 7.24179C1.63905 7.61562 1.25047 8.14255 1.05057 8.74749C0.850676 9.35245 0.849791 10.0043 1.04805 10.6098C1.2463 11.2152 1.63345 11.7432 2.15395 12.1184L5.35489 14.4259L4.13848 18.1401C4.13841 18.1403 4.13834 18.1405 4.13827 18.1407C3.93111 18.7482 3.92855 19.4055 4.13099 20.0146C4.33338 20.6235 4.72973 21.1514 5.26072 21.5199C5.78291 21.8998 6.41538 22.1032 7.06402 22.1C7.71282 22.0968 8.34336 21.887 8.86175 21.5018C8.86193 21.5017 8.8621 21.5016 8.86228 21.5014L11.9942 19.2288L15.1278 21.4994C15.1278 21.4994 15.1278 21.4994 15.1278 21.4995C15.649 21.8774 16.2781 22.0826 16.9247 22.0857C17.5713 22.0888 18.2024 21.8897 18.7273 21.5167C19.2522 21.1438 19.6438 20.6162 19.8457 20.0096C20.0475 19.403 20.0491 18.7488 19.8501 18.1413L18.6333 14.4259L21.837 12.119C21.8372 12.1189 21.8373 12.1188 21.8375 12.1187C22.364 11.7481 22.7557 11.22 22.9544 10.6124C23.1531 10.005 23.1483 9.35063 22.9407 8.74615C22.7464 8.13733 22.3588 7.6065 21.8353 7.23192C21.3117 6.85723 20.6799 6.65868 20.0333 6.66542H16.1008L14.9066 2.99575C14.9066 2.99575 14.9066 2.99574 14.9066 2.99573C14.7087 2.38682 14.3198 1.8559 13.7963 1.47934C13.2728 1.10279 12.6418 0.9 11.9941 0.9C11.3465 0.9 10.7154 1.10279 10.1919 1.47934C9.66845 1.8559 9.27955 2.38682 9.08159 2.99573C9.08159 2.99574 9.08159 2.99575 9.08158 2.99575L7.88743 6.66542H3.95441ZM7.14836 13.2343L3.34915 10.4963L7.14836 13.2343Z"
                          fill="white"
                          stroke="white"
                          strokeWidth="0.2"
                        />
                      </svg>
                      <span>{courseData.reviews}</span>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18.416 23H5.584C4.36857 22.9989 3.20323 22.5156 2.34379 21.6562C1.48436 20.7968 1.00106 19.6314 1 18.416V5.584C1.00106 4.36857 1.48436 3.20323 2.34379 2.34379C3.20323 1.48436 4.36857 1.00106 5.584 1H18.416C19.6314 1.00106 20.7968 1.48436 21.6562 2.34379C22.5156 3.20323 22.9989 4.36857 23 5.584V18.416C22.9989 19.6314 22.5156 20.7968 21.6562 21.6562C20.7968 22.5156 19.6314 22.9989 18.416 23ZM5.584 2.834C4.85465 2.834 4.15518 3.12373 3.63946 3.63946C3.12373 4.15518 2.834 4.85465 2.834 5.584V18.416C2.834 19.1453 3.12373 19.8448 3.63946 20.3605C4.15518 20.8763 4.85465 21.166 5.584 21.166H18.416C19.1453 21.166 19.8448 20.8763 20.3605 20.3605C20.8763 19.8448 21.166 19.1453 21.166 18.416V5.584C21.166 4.85465 20.8763 4.15518 20.3605 3.63946C19.8448 3.12373 19.1453 2.834 18.416 2.834H5.584ZM9.564 16.588C9.18159 16.5869 8.80625 16.4848 8.476 16.292C8.14838 16.1066 7.87602 15.8374 7.68691 15.5119C7.49781 15.1864 7.39878 14.8164 7.4 14.44V9.56C7.40043 9.18548 7.49905 8.81762 7.68603 8.49311C7.873 8.1686 8.14179 7.89879 8.46559 7.71058C8.78938 7.52237 9.15687 7.42235 9.53138 7.4205C9.9059 7.41864 10.2744 7.51501 10.6 7.7L15.456 10.116C15.7919 10.2976 16.0732 10.5658 16.2707 10.8926C16.4681 11.2195 16.5746 11.5932 16.5791 11.9751C16.5836 12.3569 16.4859 12.733 16.2962 13.0644C16.1065 13.3959 15.8316 13.6705 15.5 13.86L10.572 16.324C10.2649 16.4988 9.91733 16.5899 9.564 16.588ZM9.54 9.254C9.4895 9.25382 9.43984 9.26693 9.396 9.292C9.34843 9.31849 9.30896 9.35743 9.28183 9.40464C9.2547 9.45185 9.24093 9.50556 9.242 9.56V14.44C9.24217 14.4936 9.25633 14.5462 9.28306 14.5927C9.3098 14.6391 9.34819 14.6778 9.39445 14.7048C9.4407 14.7319 9.49321 14.7464 9.5468 14.747C9.60039 14.7475 9.65319 14.7341 9.7 14.708L14.628 12.244C14.6651 12.2155 14.6947 12.1784 14.7142 12.1358C14.7337 12.0933 14.7426 12.0467 14.74 12C14.7413 11.9455 14.7276 11.8917 14.7005 11.8445C14.6733 11.7972 14.6337 11.7583 14.586 11.732L9.75 9.316C9.68956 9.27894 9.6208 9.25762 9.55 9.254H9.54Z"
                          fill="white"
                          stroke="white"
                          strokeWidth="0.2"
                        />
                      </svg>
                      <span>{courseData.noOfVideos} Video Lectures</span>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="22"
                        viewBox="0 0 16 22"
                        fill="none"
                      >
                        <path
                          d="M14.6978 3.23177L13.2258 1.78102C12.8139 1.37354 12.3241 1.05051 11.7845 0.830631C11.245 0.610748 10.6666 0.498376 10.0827 0.500018H4.44444C3.26613 0.501407 2.13649 0.962789 1.30331 1.78296C0.470117 2.60313 0.00141143 3.71512 0 4.87501V17.125C0.00141143 18.2849 0.470117 19.3969 1.30331 20.2171C2.13649 21.0372 3.26613 21.4986 4.44444 21.5H11.5555C12.7339 21.4986 13.8635 21.0372 14.6967 20.2171C15.5299 19.3969 15.9986 18.2849 16 17.125V6.32489C16.0014 5.75017 15.8871 5.18088 15.6635 4.64996C15.44 4.11903 15.1118 3.637 14.6978 3.23177ZM13.4409 4.46901C13.567 4.59267 13.6798 4.72871 13.7778 4.87501H11.5555V2.68752C11.7039 2.78492 11.8424 2.89628 11.9689 3.02002L13.4409 4.46901ZM14.2222 17.125C14.2222 17.8212 13.9413 18.4889 13.4412 18.9812C12.9411 19.4734 12.2628 19.75 11.5555 19.75H4.44444C3.7372 19.75 3.05892 19.4734 2.55882 18.9812C2.05873 18.4889 1.77778 17.8212 1.77778 17.125V4.87501C1.77778 4.17882 2.05873 3.51114 2.55882 3.01886C3.05892 2.52658 3.7372 2.25002 4.44444 2.25002H9.77777V4.87501C9.77777 5.33914 9.96507 5.78426 10.2985 6.11245C10.6319 6.44064 11.0841 6.62501 11.5555 6.62501H14.2222V17.125ZM11.5555 8.37501C11.7913 8.37501 12.0174 8.4672 12.1841 8.63129C12.3508 8.79539 12.4444 9.01795 12.4444 9.25001C12.4444 9.48207 12.3508 9.70463 12.1841 9.86873C12.0174 10.0328 11.7913 10.125 11.5555 10.125H4.44444C4.20869 10.125 3.9826 10.0328 3.8159 9.86873C3.6492 9.70463 3.55555 9.48207 3.55555 9.25001C3.55555 9.01795 3.6492 8.79539 3.8159 8.63129C3.9826 8.4672 4.20869 8.37501 4.44444 8.37501H11.5555ZM12.4444 12.75C12.4444 12.9821 12.3508 13.2046 12.1841 13.3687C12.0174 13.5328 11.7913 13.625 11.5555 13.625H4.44444C4.20869 13.625 3.9826 13.5328 3.8159 13.3687C3.6492 13.2046 3.55555 12.9821 3.55555 12.75C3.55555 12.5179 3.6492 12.2954 3.8159 12.1313C3.9826 11.9672 4.20869 11.875 4.44444 11.875H11.5555C11.7913 11.875 12.0174 11.9672 12.1841 12.1313C12.3508 12.2954 12.4444 12.5179 12.4444 12.75ZM12.2738 15.7364C12.4119 15.9235 12.4692 16.1569 12.4331 16.3854C12.3969 16.614 12.2703 16.8192 12.0809 16.9561C11.1803 17.5878 10.1136 17.9503 9.00888 18C8.36344 17.9969 7.73761 17.7813 7.2311 17.3875C6.93955 17.1906 6.82844 17.125 6.60888 17.125C6.0146 17.2155 5.45388 17.4547 4.98044 17.8198C4.79266 17.9515 4.56021 18.0063 4.33217 17.9725C4.10413 17.9387 3.89835 17.819 3.75829 17.6387C3.61824 17.4583 3.55486 17.2315 3.58155 17.006C3.60824 16.7805 3.7229 16.5741 3.90133 16.4303C4.6846 15.8317 5.62513 15.4656 6.61244 15.375C7.20456 15.3843 7.77699 15.5858 8.24088 15.9481C8.45234 16.1353 8.72458 16.2424 9.00888 16.25C9.7357 16.1964 10.4346 15.952 11.0329 15.5421C11.2236 15.406 11.4615 15.35 11.6942 15.3864C11.9268 15.4229 12.1353 15.5487 12.2738 15.7364Z"
                          fill="white"
                        />
                      </svg>
                      <span>{courseData.noOfAssignments} Assignments</span>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="23"
                        viewBox="0 0 18 23"
                        fill="none"
                      >
                        <path
                          d="M3.18465 22.7001C2.42074 22.6969 1.68891 22.3866 1.14818 21.8366C0.607454 21.2865 0.301527 20.5412 0.296875 19.7626L0.296875 3.2428C0.300366 2.46336 0.605781 1.71689 1.14663 1.16588C1.68748 0.614871 2.41998 0.303942 3.18465 0.300781L11.7566 0.300781C11.8284 0.301843 11.8992 0.317692 11.9648 0.347372C12.0303 0.377053 12.0894 0.419952 12.1382 0.473488L17.5528 6.26291C17.645 6.3669 17.6973 6.50126 17.7002 6.64136V19.7626C17.6955 20.5412 17.3896 21.2865 16.8489 21.8366C16.3081 22.3866 15.5763 22.6969 14.8124 22.7001H3.18465ZM1.35917 3.23829V19.758C1.36264 20.2505 1.55608 20.7217 1.89767 21.0699C2.23927 21.4181 2.70158 21.6152 3.18465 21.6188H14.8242C15.3071 21.6168 15.7698 21.4208 16.1118 21.0733C16.4539 20.7258 16.6476 20.2548 16.6511 19.7626V7.1715H13.5571C13.252 7.17189 12.9499 7.11101 12.6679 6.99234C12.386 6.87367 12.1297 6.69952 11.9138 6.47986C11.6979 6.2602 11.5265 5.99933 11.4096 5.71215C11.2926 5.42497 11.2323 5.11711 11.2321 4.80617V1.38358H3.18465C2.70259 1.38709 2.24116 1.58344 1.89973 1.93034C1.5583 2.27724 1.36417 2.74694 1.35917 3.23829ZM12.2929 4.80617C12.2941 5.14713 12.4278 5.47372 12.6648 5.71439C12.9017 5.95507 13.2226 6.09021 13.5571 6.0902H15.9145L12.2929 2.21107V4.80617ZM4.63149 18.9711C4.49062 18.9711 4.35552 18.9141 4.25591 18.8125C4.15631 18.711 4.10035 18.5733 4.10035 18.4297C4.10035 18.2861 4.15631 18.1484 4.25591 18.0469C4.35552 17.9454 4.49062 17.8883 4.63149 17.8883H13.3685C13.5094 17.8883 13.6445 17.9454 13.7441 18.0469C13.8437 18.1484 13.8996 18.2861 13.8996 18.4297C13.8996 18.5733 13.8437 18.711 13.7441 18.8125C13.6445 18.9141 13.5094 18.9711 13.3685 18.9711H4.63149ZM8.60955 15.9465L5.50961 12.5389C5.46221 12.487 5.42529 12.4262 5.40097 12.3598C5.37665 12.2933 5.3654 12.2227 5.36786 12.1519C5.37032 12.081 5.38645 12.0114 5.41532 11.9469C5.44419 11.8824 5.48525 11.8243 5.53613 11.776C5.6389 11.6784 5.77549 11.6264 5.91586 11.6315C5.98536 11.634 6.05369 11.6505 6.11696 11.6799C6.18023 11.7093 6.23719 11.7512 6.2846 11.803L8.47106 14.2059V8.29184C8.47106 8.14825 8.52702 8.01054 8.62663 7.90901C8.72624 7.80748 8.86133 7.75044 9.0022 7.75044C9.14307 7.75044 9.27817 7.80748 9.37778 7.90901C9.47739 8.01054 9.53335 8.14825 9.53335 8.29184V14.1999L11.7257 11.797C11.8214 11.6923 11.9541 11.6306 12.0944 11.6255C12.2348 11.6204 12.3714 11.6724 12.4742 11.77C12.5769 11.8676 12.6375 12.0028 12.6424 12.1459C12.6474 12.2889 12.5964 12.4282 12.5007 12.5329L9.38896 15.942C9.33957 15.9965 9.27965 16.04 9.21296 16.0697C9.14627 16.0995 9.07426 16.1149 9.00147 16.1149C8.92867 16.1149 8.85666 16.0995 8.78998 16.0697C8.72329 16.04 8.66336 15.9965 8.61397 15.942L8.60955 15.9465Z"
                          fill="white"
                          stroke="white"
                          strokeWidth="0.4"
                        />
                      </svg>
                      <span>{courseData.noOfNotes} Downloadable Notes</span>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="24"
                        viewBox="0 0 22 24"
                        fill="none"
                      >
                        <path
                          d="M11 0.974609C8.82441 0.974609 6.69767 1.62299 4.88873 2.83776C3.07979 4.05253 1.66989 5.77913 0.83733 7.79921C0.00476615 9.8193 -0.213071 12.0421 0.211367 14.1867C0.635804 16.3312 1.68345 18.301 3.22183 19.8471C4.76021 21.3933 6.72022 22.4462 8.85401 22.8727C10.9878 23.2993 13.1995 23.0804 15.2095 22.2436C17.2195 21.4069 18.9375 19.9899 20.1462 18.1719C21.3549 16.3538 22 14.2164 22 12.0299C21.9968 9.09882 20.8369 6.28871 18.7747 4.21613C16.7125 2.14355 13.9164 0.97778 11 0.974609V0.974609ZM11 21.2426C9.18701 21.2426 7.41473 20.7023 5.90728 19.69C4.39983 18.6777 3.22491 17.2389 2.53111 15.5554C1.83731 13.872 1.65578 12.0197 2.00947 10.2326C2.36317 8.44548 3.23621 6.80393 4.51819 5.5155C5.80017 4.22708 7.43352 3.34965 9.21168 2.99418C10.9898 2.6387 12.8329 2.82114 14.5079 3.51843C16.1829 4.21572 17.6146 5.39654 18.6218 6.91157C19.6291 8.42659 20.1667 10.2078 20.1667 12.0299C20.164 14.4724 19.1974 16.8142 17.4789 18.5413C15.7604 20.2684 13.4303 21.2399 11 21.2426Z"
                          fill="white"
                        />
                        <path
                          d="M11.0012 6.50244C10.7581 6.50244 10.5249 6.5995 10.353 6.77227C10.1811 6.94504 10.0845 7.17937 10.0845 7.42371V11.4082L6.99446 13.3539C6.78781 13.4836 6.64091 13.6906 6.58607 13.9291C6.53124 14.1677 6.57295 14.4185 6.70205 14.6261C6.83114 14.8338 7.03704 14.9815 7.27444 15.0366C7.51185 15.0917 7.76131 15.0498 7.96796 14.92L11.488 12.709C11.621 12.6252 11.7303 12.5086 11.8056 12.3702C11.8809 12.2318 11.9195 12.0763 11.9179 11.9186V7.42371C11.9179 7.17937 11.8213 6.94504 11.6494 6.77227C11.4775 6.5995 11.2443 6.50244 11.0012 6.50244Z"
                          fill="white"
                        />
                      </svg>
                      <span>{courseData.duration}</span>
                    </div>
                  </div>

                  {courseData?.isAlreadyPurchased === false ? (
                    <a className="buy-now-btn" onClick={handlePayment}>
                      Enroll now for Just{" "}
                      <FormatPrice price={courseData.offeredPrice} />{" "}
                      <span>
                        <FormatPrice price={courseData.actualPrice} />
                      </span>
                    </a>
                  ) : (
                    <a
                      className="buy-now-btn"
                      onClick={() => handleNavigatetoCourse()}
                    >
                      Go To Course
                    </a>
                  )}
                </div>

                <Modal
                  show={showSuccessModal}
                  onHide={() => setShowSuccessModal(false)}
                  className="payment-modal"
                >
                  <Modal.Body>
                    <div className="receipt-block show success-block w-100">
                      <div className="success-tick-block">
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
                      <div className="success-text-block">
                        <div className="course-title">
                          Your payment has been successfully completed...!
                        </div>

                        <div>
                          Your payment for{" "}
                          <Link
                            onClick={navigateToDashboard}
                            className="d-block"
                          >
                            {courseData?.courseName}
                          </Link>{" "}
                          has been successfully completed...!
                        </div>

                        <div className="btn-list">
                          <a
                            className="btn support-btn"
                            onClick={navigateToDashboard}
                          >
                            View Course
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="14"
                              viewBox="0 0 15 14"
                              fill="none"
                            >
                              <path
                                d="M8.70071 13.6584C8.60108 13.5501 8.52205 13.4214 8.46813 13.2798C8.4142 13.1382 8.38645 12.9864 8.38645 12.833C8.38645 12.6797 8.4142 12.5279 8.46813 12.3863C8.52205 12.2447 8.60108 12.116 8.70071 12.0077L12.2281 8.16599L1.07152 8.15782C0.787333 8.15782 0.514787 8.03491 0.313839 7.81613C0.11289 7.59734 0 7.30061 0 6.9912C0 6.6818 0.11289 6.38506 0.313839 6.16628C0.514787 5.94749 0.787333 5.82458 1.07152 5.82458L12.2303 5.83275L8.70071 1.99224C8.49965 1.77349 8.38664 1.47674 8.38654 1.16727C8.38644 0.857799 8.49926 0.560961 8.70017 0.342056C8.90109 0.12315 9.17365 0.000109468 9.45789 7.30087e-08C9.74213 -0.000109322 10.0148 0.122722 10.2158 0.341473L14.0583 4.52497C14.3568 4.84997 14.5937 5.23582 14.7553 5.66048C14.9168 6.08514 15 6.54029 15 6.99995C15 7.45961 14.9168 7.91476 14.7553 8.33943C14.5937 8.76409 14.3568 9.14993 14.0583 9.47493L10.2158 13.6584C10.0149 13.8771 9.7424 14 9.45827 14C9.17414 14 8.90165 13.8771 8.70071 13.6584Z"
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
                  show={showFailureModal}
                  className="payment-modal"
                  onHide={() => setShowFailureModal(false)}
                >
                  <Modal.Body>
                    <div className="receipt-block show success-block w-100">
                      <div className="success-tick-block red-bg">
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
                          <circle
                            cx="73.3943"
                            cy="120.151"
                            r="8.24981"
                            fill="white"
                          />
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
                      <div className="success-text-block">
                        <div className="course-title">
                          Your payment has been Unsuccessful..!
                        </div>

                        <div>
                          Support Details <br /> Number:{" "}
                          <a
                            href="tel:+91 1234567890"
                            className="d-inline-block"
                          >
                            +91 1234567890
                          </a>{" "}
                          <br />
                          Mail:
                          <a
                            href="mailto:abc@gmail.com"
                            className="d-inline-block"
                          >
                            abc@gmail.com
                          </a>
                        </div>

                        <div className="btn-list text-center my-4">
                          <Link
                            className="support-btn"
                            onClick={() => setShowFailureModal(false)}
                          >
                            Close
                          </Link>
                          <Link
                            className="support-btn  ms-2"
                            onClick={handleRetryPayment}
                          >
                            Retry Now
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="14"
                              viewBox="0 0 15 14"
                              fill="none"
                              className=" ms-2"
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="hightlight-section">
                <h3 className="section-heading text-center">
                  Training highlights{" "}
                </h3>

                <ul className="hightlight-list">
                  {courseData.highlightList?.map((item, index) => {
                    return (
                      <>
                        <li key={index}>
                          <div className="hightlight-list-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="35"
                              height="24"
                              viewBox="0 0 35 24"
                              fill="none"
                            >
                              <path
                                d="M3 12.0782L8.70355 19.7642C10.1706 21.7412 13.0583 21.9364 14.778 20.1747L32 2.53271"
                                stroke="#FFF"
                                strokeWidth="5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>

                          <span>{item}</span>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading text-center">
                Certificate to light up your resume...?
              </h3>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-6">
              <p className="section-content">{courseData.courseDescription}</p>
            </div>

            <div className="col-6">
              <img
                src={require("../assets/certificate.png")}
                alt=""
                className="w-100"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="col-12">
            <h3 className="section-heading text-center py-5">
              What placement assistance you will recieve...?
            </h3>
          </div>
          <div className="row">
            <div className="col-6">
              <img
                src={require("../assets/placement-assistance.png")}
                className="img-fluid"
                alt="rocket"
              />
            </div>

            <div className="col-6">
              <div className="accordion" id="accordionExample">
                {courseData?.placementList?.map((placement, index) => (
                  <div className="accordion-item">
                    <h2 className="accordion-header" id={`heading1${index}`}>
                      <button
                        className={`accordion-button position-relative ${
                          index === 0 ? " " : "collapsed"
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse1${index}`}
                        aria-expanded="false"
                        aria-controls={`collapse1${index}`}
                      >
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="24"
                            viewBox="0 0 35 24"
                            fill="none"
                          >
                            <path
                              d="M3 12.0782L8.70355 19.7642C10.1706 21.7412 13.0583 21.9364 14.778 20.1747L32 2.53271"
                              stroke="#FFF"
                              strokeWidth="5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <h4>{placement.title}</h4>
                      </button>
                    </h2>
                    <div
                      id={`collapse1${index}`}
                      className={`accordion-collapse collapse ${
                        index == 0 ? "show" : ""
                      }`}
                      aria-labelledby={`heading1${index}`}
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        {placement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 course-curri-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading text-center">Course Curriculum</h3>

              <div className="course-curri-accordian">
                <div className="accordion" id="accordionExample">
                  {courseData.courseCurriculumList?.map((courseCurriculum, index) => (
                    <div
                      className={`accordion-item ${
                        index < 5 || showAll ? "" : "d-none"
                      }`}
                      key={index}
                    >
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className={`accordion-button position-relative ${
                            index === 0 ? " " : "collapsed"
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                          aria-controls={`collapse${index}`}
                        >
                          <span className="accordion-number"></span>
                          <h4>{courseCurriculum.title}</h4>
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${
                          index === 0 ? "show" : ""
                        }`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <strong>
                            {courseCurriculum.description}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!showAll ? (
                <a
                  className="buy-now-btn m-auto d-block pe-auto"
                  onClick={handleShowMoreClick}
                >
                  Show More
                </a>
              ) : (
                <a
                  className="buy-now-btn m-auto d-block pe-auto"
                  onClick={handleShowLessClick}
                >
                  Show Less
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 training-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading text-center">
                How will your training work...?
              </h3>

              <img
                src={require("../assets/training-work.png")}
                alt=""
                className="img-fluid w-100"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 mb-5 student-clientle-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading text-center">
                What students talk about us...?
              </h3>

              <div className="position-relative">
                <img
                  src={require("../assets/testimonial-quote-up.png")}
                  className="testimonial-quote-up"
                  alt=""
                />
                <Slider {...settings}>
                  {courseData?.reviewList?.map((review) => (
                    <div className="slide-item">
                      <div>
                        {review.profilePic?.filePath ? (
                          <>
                            <div>
                              <img
                                className="testimonial-student-img"
                                src={review.profilePic?.filePath}
                              />
                              <h4>{review.studentName}</h4>
                              <p>{review.title}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <img
                                src={require("../assets/client-img.png")}
                                className="testimonial-student-img"
                              />
                              <h4>{review.studentName}</h4>
                              <p>{review.title}</p>
                            </div>
                          </>
                        )}

                        <div className="slide-item-content">
                          <div className="review d-flex align-items-center">
                            <StarRatings
                              rating={review.rating}
                              starRatedColor="#FFC107"
                              starDimension="30px"
                              starSpacing="2px"
                            />
                            {/* <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="250"
                              height="42"
                              viewBox="0 0 250 42"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_727_21386)">
                                <path
                                  d="M238.821 41.667L227.74 35.1472L216.655 41.667C216.257 41.901 215.799 42.0148 215.336 41.9944C214.873 41.9739 214.426 41.82 214.051 41.5518C213.676 41.2836 213.39 40.9129 213.227 40.4858C213.064 40.0587 213.033 39.5939 213.136 39.1492L215.998 26.7306L206.286 18.3442C205.937 18.0443 205.685 17.6501 205.561 17.2104C205.437 16.7707 205.448 16.3049 205.591 15.871C205.734 15.437 206.003 15.0539 206.365 14.7694C206.728 14.4848 207.167 14.3113 207.628 14.2703L220.478 13.1344L225.563 1.41623C225.744 0.995743 226.048 0.637123 226.435 0.385036C226.822 0.132949 227.276 -0.00146484 227.74 -0.00146484C228.204 -0.00146484 228.658 0.132949 229.045 0.385036C229.432 0.637123 229.735 0.995743 229.917 1.41623L234.998 13.1193L247.851 14.2551C248.313 14.2971 248.752 14.4713 249.114 14.7563C249.476 15.0413 249.745 15.4246 249.887 15.8586C250.03 16.2926 250.041 16.7583 249.917 17.1981C249.794 17.6379 249.542 18.0324 249.194 18.3328L239.474 26.7306L242.336 39.1492C242.439 39.5939 242.408 40.0587 242.245 40.4858C242.082 40.9129 241.796 41.2836 241.421 41.5518C241.046 41.82 240.599 41.9739 240.136 41.9944C239.673 42.0148 239.215 41.901 238.817 41.667H238.821ZM187.451 41.667L176.367 35.1472L165.282 41.667C164.885 41.9014 164.427 42.0156 163.965 41.9954C163.502 41.9752 163.056 41.8215 162.682 41.5534C162.306 41.2861 162.017 40.9156 161.853 40.4881C161.689 40.0605 161.656 39.5949 161.759 39.1492L164.613 26.7306L154.917 18.3442C154.569 18.0435 154.319 17.6493 154.196 17.2101C154.074 16.7709 154.084 16.306 154.227 15.8728C154.37 15.4395 154.638 15.0569 154.999 14.7721C155.361 14.4874 155.798 14.3129 156.259 14.2703L169.113 13.1344L174.19 1.41623C174.371 0.995743 174.675 0.637123 175.062 0.385036C175.449 0.132949 175.903 -0.00146484 176.367 -0.00146484C176.831 -0.00146484 177.285 0.132949 177.672 0.385036C178.059 0.637123 178.362 0.995743 178.544 1.41623L183.624 13.1231L196.474 14.2589C196.936 14.3009 197.375 14.4751 197.737 14.7601C198.099 15.0451 198.368 15.4284 198.511 15.8624C198.653 16.2964 198.664 16.7621 198.54 17.2019C198.417 17.6417 198.166 18.0362 197.817 18.3366L188.105 26.7306L190.971 39.1492C191.075 39.5944 191.043 40.0599 190.88 40.4877C190.718 40.9155 190.431 41.2867 190.055 41.5551C189.679 41.8235 189.232 41.9772 188.768 41.9971C188.305 42.017 187.845 41.9022 187.448 41.667H187.451ZM136.082 41.667L124.998 35.1472L113.909 41.667C113.511 41.8998 113.053 42.0127 112.591 41.9916C112.129 41.9705 111.683 41.8165 111.309 41.5485C110.934 41.2805 110.648 40.9103 110.486 40.4839C110.323 40.0574 110.291 39.5934 110.394 39.1492L113.255 26.7306L103.548 18.3442C103.2 18.0435 102.949 17.6493 102.827 17.2101C102.704 16.7709 102.715 16.306 102.858 15.8728C103.001 15.4395 103.269 15.0569 103.63 14.7721C103.991 14.4874 104.429 14.3129 104.89 14.2703L117.744 13.1344L122.824 1.41623C123.006 0.995743 123.309 0.637123 123.696 0.385036C124.083 0.132949 124.537 -0.00146484 125.001 -0.00146484C125.465 -0.00146484 125.919 0.132949 126.306 0.385036C126.694 0.637123 126.997 0.995743 127.178 1.41623L132.259 13.1231L145.109 14.2589C145.571 14.3009 146.009 14.4751 146.371 14.7601C146.733 15.0451 147.002 15.4284 147.145 15.8624C147.288 16.2964 147.298 16.7621 147.175 17.2019C147.052 17.6417 146.8 18.0362 146.451 18.3366L136.736 26.7306L139.598 39.1492C139.701 39.5944 139.67 40.0599 139.507 40.4877C139.344 40.9155 139.057 41.2867 138.682 41.5551C138.306 41.8235 137.859 41.9772 137.395 41.9971C136.932 42.017 136.472 41.9022 136.074 41.667H136.082ZM84.7129 41.667L73.6283 35.1472L62.5437 41.667C62.1459 41.901 61.687 42.0148 61.2241 41.9944C60.7612 41.9739 60.3145 41.82 59.9397 41.5518C59.5648 41.2836 59.2783 40.9129 59.1155 40.4858C58.9528 40.0587 58.9212 39.5939 59.0244 39.1492L61.886 26.7306L52.1744 18.3442C51.8252 18.0443 51.5731 17.6501 51.4495 17.2104C51.3259 16.7707 51.3362 16.3049 51.4792 15.871C51.6222 15.437 51.8915 15.0539 52.2538 14.7694C52.616 14.4848 53.0552 14.3113 53.5167 14.2703L66.3667 13.1344L71.4514 1.41623C71.6329 0.995743 71.9361 0.637123 72.3232 0.385036C72.7103 0.132949 73.1642 -0.00146484 73.6283 -0.00146484C74.0924 -0.00146484 74.5463 0.132949 74.9334 0.385036C75.3205 0.637123 75.6237 0.995743 75.8052 1.41623L80.8821 13.1193L93.736 14.2551C94.1975 14.2971 94.6363 14.4713 94.9983 14.7563C95.3602 15.0413 95.6292 15.4246 95.7721 15.8586C95.9149 16.2926 95.9254 16.7583 95.802 17.1981C95.6787 17.6379 95.4271 18.0324 95.0783 18.3328L85.3821 26.7306L88.2437 39.1492C88.347 39.5939 88.3153 40.0587 88.1526 40.4858C87.9899 40.9129 87.7033 41.2836 87.3284 41.5518C86.9536 41.82 86.5069 41.9739 86.044 41.9944C85.5811 42.0148 85.1222 41.901 84.7244 41.667H84.7129ZM33.3437 41.667L22.2591 35.1472L11.1744 41.667C10.7776 41.9014 10.3194 42.0156 9.85707 41.9954C9.39473 41.9752 8.94865 41.8215 8.57444 41.5534C8.19786 41.2861 7.90954 40.9156 7.7454 40.4881C7.58125 40.0605 7.54855 39.5949 7.65136 39.1492L10.5167 26.7306L0.805205 18.3442C0.457671 18.0435 0.207172 17.6493 0.0846218 17.2101C-0.0379283 16.7709 -0.0271658 16.306 0.115581 15.8728C0.258328 15.4395 0.526812 15.0569 0.887898 14.7721C1.24898 14.4874 1.68687 14.3129 2.14751 14.2703L15.0014 13.1344L20.0821 1.41623C20.2637 0.995743 20.5669 0.637123 20.954 0.385036C21.3411 0.132949 21.7949 -0.00146484 22.2591 -0.00146484C22.7232 -0.00146484 23.1771 0.132949 23.5641 0.385036C23.9512 0.637123 24.2544 0.995743 24.436 1.41623L29.5167 13.1193L42.3667 14.2551C42.8282 14.2971 43.2671 14.4713 43.629 14.7563C43.9909 15.0413 44.26 15.4246 44.4028 15.8586C44.5457 16.2926 44.5561 16.7583 44.4328 17.1981C44.3095 17.6379 44.0579 18.0324 43.7091 18.3328L33.9937 26.7306L36.8591 39.1492C36.963 39.5944 36.9316 40.0599 36.7688 40.4877C36.606 40.9155 36.319 41.2867 35.9434 41.5551C35.5679 41.8235 35.1204 41.9772 34.6568 41.9971C34.1932 42.017 33.7338 41.9022 33.336 41.667H33.3437Z"
                                  fill="#FFC107"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_727_21386">
                                  <rect width="250" height="42" fill="white" />
                                </clipPath>
                              </defs>
                            </svg> */}

                            <h4 className="d-inline ms-2 my-auto">
                              {review.rating}
                            </h4>
                          </div>
                          <span className="green-devider"></span>
                          <p>{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
                <img
                  src={require("../assets/testimonial-quote-down.png")}
                  className="testimonial-quote-down"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />

    </>
  );
};

export default BuyNow;
