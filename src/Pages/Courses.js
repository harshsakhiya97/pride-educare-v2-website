import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";
import axios from "../helper/axios";
import { AuthContext } from "../context/AuthContext";
import placeholderSvg from "../assets/prideplaceholder.svg";
import Footer from "./Footer";

const Courses = () => {
  const defaultData = [];
  const [courses, setCourses] = useState(defaultData);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const fetchCourses = async () => {
    try {
      const param = {};
      const response = await axios.post("course/listWithCategory", param, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(courses, "courses");

  // const handleClick = (id) => {
  //   navigate(`/buy-now/${id}`);
  // };

  return (
    <>
      <Navbar />

      <section className="courses-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="banner-content position-relative">
                <img
                  src={require("../assets/courses-banner.jpg")}
                  className="w-100"
                  alt=""
                />
                <div className="banner-data">
                  <h3>Explore Courses</h3>
                  <p>
                    We have a vide variety of courses for your career
                    developement, start learning today ;)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {courses.length > 0 ? (<>

        <section className="course-category-section">
          <div className="container">
            <div className="row">
              {courses.map((course) => (
                <div className="course-category-title col-2 text-center">
                  <a
                    className="text-decoration-none pe-auto"
                    href={`/#/courses`}
                  >
                    {course.category.field1 != null ? (
                      <img
                        src={course.category.field1}
                        alt={course.category.name}
                        className="course-category-img pb-3 d-block m-auto"
                      />
                    ) : (
                      <img
                        src={placeholderSvg}
                        className="w-100 img-responsive"
                        height={150}
                      />
                    )}
                    <h4 title={course.category.name}>{course.category.name}</h4>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="container">
            {courses.map((course) => (
              <div
                className="row row-responsive"
                key={course.category.predefinedId}
                id={course.category.name}
              >
                <div className="col-12">
                  <h3 className="section-heading mt-0 mb-3">
                    {course.category.name}
                  </h3>
                </div>
                {course.courseList?.map((courseList, courseIndex) => (
                  <div className="col-3" key={courseList.courseMasterId}>
                    <div className="course-module w-100">
                      <NavLink
                        to={`/buy-now/${courseList.courseMasterId}`}
                        key={courseIndex}
                        className="course-nav"
                      >
                        <img
                          src={courseList.courseThumbnail?.filePath}
                          className="w-100 img-responsive"
                          alt={courseList.courseName}
                        />
                        <div className="course-details">
                          <h4
                            className="course-title"
                            title={courseList.courseName}
                          >
                            {courseList.courseName}
                          </h4>

                          <ul className="course-detail-list">
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
                              {courseList.noOfVideos} Videos
                            </li>

                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="19"
                                viewBox="0 0 21 19"
                                fill="none"
                              >
                                <path
                                  d="M20.2605 7.04542C20.0731 6.51125 19.7212 6.05021 19.2553 5.72853C18.7895 5.40685 18.2336 5.24109 17.6676 5.25506H13.9792L12.8579 1.93615C12.663 1.40408 12.3093 0.944703 11.8447 0.620163C11.3801 0.295623 10.8271 0.121582 10.2603 0.121582C9.69357 0.121582 9.14049 0.295623 8.67591 0.620163C8.21133 0.944703 7.85767 1.40408 7.66275 1.93615L6.54147 5.25506H2.85306C2.29005 5.24968 1.73926 5.41921 1.27677 5.74025C0.814277 6.06129 0.4629 6.51799 0.271173 7.04727C0.0936848 7.56945 0.0918718 8.13535 0.266011 8.65866C0.44015 9.18197 0.780685 9.63398 1.23569 9.94578L4.24175 12.0367L3.09834 15.4054C2.91617 15.9319 2.91582 16.5044 3.09735 17.0312C3.27889 17.5579 3.63182 18.0087 4.09974 18.3113C4.57178 18.6393 5.1335 18.8139 5.70838 18.8113C6.28326 18.8087 6.84335 18.6289 7.31235 18.2965L10.2631 16.2351L13.2138 18.2947C13.685 18.6207 14.2439 18.7966 14.8169 18.7992C15.3899 18.8019 15.9504 18.6311 16.4246 18.3094C16.8873 18.0025 17.2361 17.5518 17.4171 17.0269C17.5981 16.5021 17.6012 15.9322 17.426 15.4054L16.2826 12.0367L19.2812 9.94578C19.745 9.64101 20.0935 9.19009 20.2716 8.66461C20.4497 8.13914 20.4471 7.56925 20.2642 7.04542H20.2605ZM18.2798 8.64772L14.7759 11.0853C14.6337 11.1809 14.5267 11.3205 14.4714 11.4827C14.4161 11.6448 14.4155 11.8207 14.4697 11.9832L15.8012 15.9014C15.8684 16.1021 15.8673 16.3193 15.7983 16.5194C15.7293 16.7194 15.5961 16.8911 15.4195 17.0077C15.2397 17.1307 15.0269 17.1966 14.809 17.1966C14.5912 17.1966 14.3784 17.1307 14.1986 17.0077L10.7555 14.5849C10.6084 14.4831 10.4337 14.4285 10.2548 14.4285C10.0759 14.4285 9.90119 14.4831 9.75408 14.5849L6.3091 16.9985C6.12988 17.1243 5.91664 17.1928 5.69763 17.1948C5.47861 17.1968 5.26417 17.1321 5.08271 17.0095C4.90641 16.8927 4.77362 16.7209 4.70493 16.5208C4.63624 16.3208 4.63549 16.1037 4.7028 15.9032L6.03801 11.9851C6.09218 11.8225 6.09158 11.6467 6.03629 11.4845C5.981 11.3223 5.87406 11.1827 5.73187 11.0871L2.22788 8.64956C2.05354 8.53113 1.923 8.35868 1.85635 8.15877C1.7897 7.95886 1.79064 7.74258 1.85903 7.54326C1.93241 7.34179 2.0666 7.1681 2.24303 7.04621C2.41945 6.92432 2.6294 6.86026 2.84384 6.86288H7.15375C7.32861 6.86548 7.49995 6.81364 7.64403 6.71452C7.7881 6.61541 7.89776 6.47395 7.95782 6.30973L9.26721 2.41923C9.34266 2.21831 9.47764 2.04518 9.6541 1.92296C9.83056 1.80075 10.0401 1.73527 10.2548 1.73527C10.4694 1.73527 10.679 1.80075 10.8555 1.92296C11.0319 2.04518 11.1669 2.21831 11.2424 2.41923L12.5536 6.30605C12.6136 6.47026 12.7233 6.61172 12.8674 6.71084C13.0115 6.80995 13.1828 6.8618 13.3577 6.8592H17.6694C17.8838 6.85657 18.0938 6.92064 18.2702 7.04253C18.4467 7.16442 18.5808 7.33811 18.6542 7.53957C18.7226 7.73889 18.7236 7.95517 18.6569 8.15508C18.5903 8.35499 18.4597 8.52745 18.2854 8.64588L18.2798 8.64772Z"
                                  fill="#929292"
                                  stroke="#929292"
                                  strokeWidth="0.2"
                                />
                              </svg>
                              {courseList.rating}
                            </li>

                            <li>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="21"
                                viewBox="0 0 18 21"
                                fill="none"
                              >
                                <path
                                  d="M7.55216 10.4805C7.77681 10.4908 7.98884 10.5873 8.14417 10.7499C8.2995 10.9125 8.38617 11.1287 8.38617 11.3536C8.38617 11.5784 8.2995 11.7946 8.14417 11.9572C7.98884 12.1198 7.77681 12.2163 7.55216 12.2266H4.93154C4.70688 12.2163 4.49485 12.1198 4.33952 11.9572C4.1842 11.7946 4.09752 11.5784 4.09752 11.3536C4.09752 11.1287 4.1842 10.9125 4.33952 10.7499C4.49485 10.5873 4.70688 10.4908 4.93154 10.4805H7.55216ZM12.7952 7.86038C12.7952 7.62858 12.7031 7.40628 12.5392 7.24237C12.3753 7.07847 12.1529 6.98639 11.9211 6.98639H4.93154C4.81349 6.98096 4.69556 6.99953 4.58489 7.04095C4.47422 7.08238 4.37309 7.14582 4.28763 7.22742C4.20217 7.30903 4.13415 7.40711 4.08768 7.51575C4.0412 7.62438 4.01724 7.7413 4.01724 7.85946C4.01724 7.97761 4.0412 8.09454 4.08768 8.20317C4.13415 8.3118 4.20217 8.40989 4.28763 8.49149C4.37309 8.5731 4.47422 8.63653 4.58489 8.67796C4.69556 8.71939 4.81349 8.73795 4.93154 8.73253H11.9211C12.1526 8.73253 12.3747 8.6407 12.5386 8.47719C12.7024 8.31369 12.7948 8.09186 12.7952 7.86038ZM4.93154 5.24025H11.9211C12.0391 5.24568 12.1571 5.22712 12.2677 5.18569C12.3784 5.14426 12.4795 5.08083 12.565 4.99922C12.6504 4.91761 12.7185 4.81953 12.7649 4.7109C12.8114 4.60226 12.8354 4.48534 12.8354 4.36718C12.8354 4.24903 12.8114 4.13211 12.7649 4.02347C12.7185 3.91484 12.6504 3.81676 12.565 3.73515C12.4795 3.65354 12.3784 3.59011 12.2677 3.54868C12.1571 3.50725 12.0391 3.48869 11.9211 3.49412H4.93154C4.81349 3.48869 4.69556 3.50725 4.58489 3.54868C4.47422 3.59011 4.37309 3.65354 4.28763 3.73515C4.20217 3.81676 4.13415 3.91484 4.08768 4.02347C4.0412 4.13211 4.01724 4.24903 4.01724 4.36718C4.01724 4.48534 4.0412 4.60226 4.08768 4.7109C4.13415 4.81953 4.20217 4.91761 4.28763 4.99922C4.37309 5.08083 4.47422 5.14426 4.58489 5.18569C4.69556 5.22712 4.81349 5.24568 4.93154 5.24025ZM15.4159 16.982V20.3304C15.4156 20.4548 15.3786 20.5764 15.3094 20.6798C15.2402 20.7833 15.1419 20.8639 15.0269 20.9116C14.912 20.9593 14.7855 20.972 14.6634 20.9479C14.5413 20.9239 14.429 20.8643 14.3407 20.7766L13.6694 20.1055L12.9981 20.7766C12.9098 20.8643 12.7975 20.9239 12.6754 20.9479C12.5533 20.972 12.4268 20.9593 12.3118 20.9116C12.1969 20.8639 12.0986 20.7833 12.0294 20.6798C11.9602 20.5764 11.9232 20.4548 11.9229 20.3304V16.982C11.2575 16.5988 10.7372 16.0066 10.4432 15.2974C10.1491 14.5881 10.0977 13.8016 10.2968 13.0601C10.496 12.3186 10.9347 11.6637 11.5446 11.1972C12.1545 10.7307 12.9015 10.4787 13.6694 10.4805C13.9649 10.484 14.2587 10.5255 14.5435 10.604V4.36626C14.5435 4.02203 14.4757 3.68117 14.3439 3.36316C14.2121 3.04515 14.0189 2.75623 13.7753 2.5129C13.5318 2.26958 13.2427 2.07662 12.9245 1.94505C12.6064 1.81349 12.2654 1.74589 11.9211 1.74614H4.93154C4.23651 1.74614 3.56994 2.02218 3.07848 2.51355C2.58702 3.00492 2.31092 3.67136 2.31092 4.36626V14.8486C2.31092 15.5435 2.58702 16.21 3.07848 16.7013C3.56994 17.1927 4.23651 17.4687 4.93154 17.4687H9.30047C9.41852 17.4633 9.53644 17.4819 9.64711 17.5233C9.75779 17.5647 9.85891 17.6282 9.94437 17.7098C10.0298 17.7914 10.0978 17.8895 10.1443 17.9981C10.1908 18.1067 10.2148 18.2237 10.2148 18.3418C10.2148 18.46 10.1908 18.5769 10.1443 18.6855C10.0978 18.7942 10.0298 18.8922 9.94437 18.9738C9.85891 19.0554 9.75779 19.1189 9.64711 19.1603C9.53644 19.2017 9.41852 19.2203 9.30047 19.2149H4.93154C3.77376 19.2134 2.66383 18.7529 1.84516 17.9344C1.02649 17.1159 0.565917 16.0062 0.564453 14.8486V4.36626C0.565917 3.20871 1.02649 2.09898 1.84516 1.28047C2.66383 0.461949 3.77376 0.00146372 4.93154 0L11.9211 0C13.0789 0.00146372 14.1888 0.461949 15.0075 1.28047C15.8261 2.09898 16.2867 3.20871 16.2882 4.36626V11.6864C16.6302 12.0706 16.882 12.5265 17.025 13.0205C17.1681 13.5146 17.1989 14.0344 17.1151 14.5419C17.0312 15.0494 16.835 15.5317 16.5407 15.9536C16.2464 16.3755 15.8614 16.7262 15.414 16.9801L15.4159 16.982ZM15.4159 13.9746C15.4159 13.6293 15.3134 13.2917 15.1215 13.0045C14.9296 12.7174 14.6569 12.4936 14.3377 12.3614C14.0186 12.2292 13.6675 12.1947 13.3287 12.262C12.9899 12.3294 12.6787 12.4957 12.4345 12.7399C12.1902 12.9841 12.0239 13.2953 11.9565 13.634C11.8891 13.9727 11.9237 14.3238 12.0559 14.6428C12.1881 14.9619 12.4119 15.2346 12.6991 15.4265C12.9863 15.6183 13.324 15.7208 13.6694 15.7208C14.1326 15.7208 14.5768 15.5368 14.9043 15.2093C15.2319 14.8819 15.4159 14.4377 15.4159 13.9746Z"
                                  fill="#929292"
                                />
                              </svg>
                              Certification
                            </li>
                          </ul>
                        </div>
                      </NavLink>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </>
      ) : (<></>)
      }

      <Footer />

    </>
  );
};

export default Courses;
