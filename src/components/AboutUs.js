import React from "react";
import DashboardNavbar from "../components/DashboardNavbar";

const AboutUs = () => {
  return (
    <>
      <DashboardNavbar />
      <section>
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6 text-center">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="back mb-4">
                  <svg
                    className="p-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="196"
                    height="215"
                    viewBox="0 0 196 215"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.3276 56.9998L21.3549 57.4728V89.2729C23.0199 90.0361 24.1747 91.7186 24.1747 93.6683C24.1747 95.6181 23.0199 97.2986 21.3549 98.0623V99.0928C22.3899 99.7616 23.0791 100.923 23.0791 102.24V135.105H22.3705V102.798C22.3705 102.673 22.2662 102.567 22.137 102.567C22.0078 102.567 21.9034 102.672 21.9034 102.798V135.105H21.3544H20.9713V102.798C20.9713 102.673 20.8669 102.567 20.7392 102.567C20.6105 102.567 20.5042 102.672 20.5042 102.798V135.105H19.5755V102.798C19.5755 102.673 19.4692 102.567 19.342 102.567C19.2128 102.567 19.107 102.672 19.107 102.798V135.105H18.1763V102.798C18.1763 102.673 18.072 102.567 17.9448 102.567C17.8156 102.567 17.7112 102.672 17.7112 102.798V135.105H17.3276H16.7791V102.798C16.7791 102.673 16.6747 102.567 16.5455 102.567C16.4178 102.567 16.312 102.672 16.312 102.798V135.105H15.6039V102.24C15.6039 100.924 16.2926 99.7616 17.3276 99.0928V98.0623C15.6646 97.2991 14.5078 95.6186 14.5078 93.6683C14.5078 91.7186 15.6646 90.0356 17.3276 89.2729V56.9998Z"
                      fill="#0681BA"
                    />
                    <path
                      d="M195.631 106.796C195.631 116.232 193.922 124.898 190.504 132.789C187.086 140.682 182.41 147.477 176.471 153.172C170.529 158.867 163.656 163.302 155.844 166.475C148.033 169.648 139.736 171.235 130.948 171.235H109.712V214.437H59.4297V85.9408C70.8277 85.7495 80.35 88.1341 93.5328 91.5442C108.51 77.7765 117.351 69.8771 138.803 63.7028L133.479 41.9089C141.34 42.1713 148.834 43.6614 155.966 46.3829C163.859 49.3945 170.734 53.706 176.592 59.3193C182.45 64.9336 187.086 71.7672 190.504 79.8212C193.921 87.8782 195.631 96.8688 195.631 106.795V106.796Z"
                      fill="#0A2F57"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.933594 51.3508L69.131 1.16295C70.1148 0.440975 72.327 0.0519179 74.0452 0.302845L156.909 12.3349L88.7112 62.5227C87.7294 63.2467 85.5173 63.6338 83.7995 63.3848L0.934091 51.3508H0.933594Z"
                      fill="#0681BA"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M92.7697 87.1751C74.5301 82.4567 63.861 79.8575 43.6413 84.1675L37.3164 59.4494C42.1148 59.8122 85.1684 66.4123 87.5191 66.1842C89.701 65.2784 124.577 39.186 128.64 36.6077L134.696 61.3923C114.829 67.1094 106.642 74.4255 92.7697 87.1756V87.1751Z"
                      fill="#0681BA"
                    />
                  </svg>
                </div>

                <h3 style={{ color: "#001548" }} className="fw-bold">
                  Pride Educare
                </h3>
                <p className="headP">Mumbai, India</p>

                <div className="aboutButton fs-5">
                  <button style={{ color: "#fff" }} className=" btn btn-sm">
                    <div className="d-flex justify-content-between align-items center">
                      <span>Contact Us</span>
                      <svg
                        className="p-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="23"
                        viewBox="0 0 25 23"
                        fill="none"
                      >
                        <path
                          d="M19.2086 0.75H19.2083L5.79167 0.75L5.79137 0.75C4.45512 0.751594 3.17387 1.28101 2.2287 2.22245C1.2835 3.16391 0.751602 4.44057 0.75 5.77243V5.77273L0.75 17.2273L0.75 17.2276C0.751602 18.5594 1.2835 19.8361 2.2287 20.7776C3.17387 21.719 4.45512 22.2484 5.79137 22.25H5.79167H19.2083H19.2086C20.5449 22.2484 21.8261 21.719 22.7713 20.7776C23.7165 19.8361 24.2484 18.5594 24.25 17.2276V17.2273V5.77273V5.77243C24.2484 4.44057 23.7165 3.16391 22.7713 2.22245C21.8261 1.28101 20.5449 0.751594 19.2086 0.75ZM16.065 13.5481L21.8333 7.80615V17.2273C21.8333 17.9201 21.557 18.5848 21.0648 19.075C20.5726 19.5653 19.9048 19.8409 19.2083 19.8409H5.79167C5.09515 19.8409 4.42737 19.5653 3.93516 19.075C3.44299 18.5848 3.16667 17.9201 3.16667 17.2273V7.80615L8.93496 13.5481L8.93513 13.5483C9.88159 14.4886 11.1636 15.0165 12.5 15.0165C13.8364 15.0165 15.1184 14.4886 16.0649 13.5483L16.065 13.5481ZM5.7918 3.15909H19.2082C19.7322 3.16019 20.2439 3.31743 20.6773 3.61047C21.0655 3.87293 21.375 4.23354 21.575 4.65383L14.3575 11.8437C14.3575 11.8437 14.3574 11.8438 14.3574 11.8438C13.8642 12.333 13.1964 12.6078 12.5 12.6078C11.8037 12.6078 11.136 12.3331 10.6428 11.844C10.6427 11.8439 10.6426 11.8438 10.6425 11.8437L3.42502 4.65383C3.62498 4.23354 3.93449 3.87293 4.32269 3.61047C4.75612 3.31743 5.26777 3.16019 5.7918 3.15909Z"
                          fill="white"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-10">
                  <h3 className="aboutHead mb-5">Company Description</h3>
                  <p className="my-4 aboutText">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    mollis, lorem id faucibus accumsan, mi lectus porta tellus,
                    nec ultrices ante odio eget metus. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit. Sed mollis, lorem id
                    faucibus accumsan, mi lectus porta tellus, nec ultrices ante
                    odio eget metus. <br />
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    mollis, lorem id faucibus accumsan, mi lectus porta tellus,
                    nec ultrices ante odio eget metus. <br />
                    <br /> Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Sed mollis, lorem id faucibus accumsan. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Sed mollis,
                    lorem id faucibus accumsan, mi lectus porta tellus, nec
                    ultrices ante odio eget metus.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-10">
                  <h3 className="aboutHead my-5">Why Pride Educare...?</h3>
                  <p className="my-4 aboutText">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    mollis, lorem id faucibus accumsan, mi lectus porta tellus,
                    nec ultrices ante odio eget metus. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit. Sed mollis, lorem id
                    faucibus accumsan, mi lectus porta tellus, nec ultrices ante
                    odio eget metus. <br />
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    mollis, lorem id faucibus accumsan, mi lectus porta tellus,
                    nec ultrices ante odio eget metus. <br />
                    <br /> Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Sed mollis, lorem id faucibus accumsan. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Sed mollis,
                    lorem id faucibus accumsan, mi lectus porta tellus, nec
                    ultrices ante odio eget metus.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-10">
                  <h3 className="aboutHead my-5">Privacy & data policy</h3>
                  <p className="my-4 aboutText">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    mollis, lorem id faucibus accumsan, mi lectus porta tellus,
                    nec ultrices ante odio eget metus. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit. Sed mollis, lorem id
                    faucibus accumsan, mi lectus porta tellus, nec ultrices ante
                    odio eget metus. <br />
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    mollis, lorem id faucibus accumsan, mi lectus porta tellus,
                    nec ultrices ante odio eget metus. <br />
                    <br /> Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Sed mollis, lorem id faucibus accumsan. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Sed mollis,
                    lorem id faucibus accumsan, mi lectus porta tellus, nec
                    ultrices ante odio eget metus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
