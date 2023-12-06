import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

const ExamModal = ({ show, onHide, data, handleClick }) => {
  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Body className="p-0">
        <Container>
          <Row>
            <Col xs={12} md={5} className="p-0 m-0">
              <div className="show success-block">
                <div className="modal1-success-tick-block red-bg d-flex flex-column justify-content-center align-items-center">
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
                    className="modal-blue-triangle"
                    viewBox="0 0 80 38"
                    fill="none"
                  >
                    <path
                      d="M38.0229 37.1732C39.1548 38.166 40.8473 38.166 41.9792 37.1732L78.1604 5.43969C80.2417 3.61427 78.9506 0.184277 76.1822 0.184277H3.8199C1.05154 0.184277 -0.239513 3.61427 1.84175 5.43969L38.0229 37.1732Z"
                      fill="#FFCDC5"
                    />
                  </svg>
                  <span className="mt-5 fw-bold fs-4">{data.head}</span>
                </div>
              </div>
            </Col>
            <Col xs={6} md={7} className="p-4">
              <div className="modal-success-text-block ms-4 px-2">
                <div className="modal-course-title mb-4">{data.title}</div>

                <div
                  className="modal-section-content"
                  dangerouslySetInnerHTML={{
                    // __html: data.content?.map((item) => `<p>${item}</p>`),
                    __html: data.content
                      ?.map((item, index) => `<p key=${index}>${item}</p>`)
                      .join(""),
                  }}
                ></div>
                {data.call && (
                  <div className="btn-list text-center">
                    <a
                      className="btn support-btn"
                      onClick={() => handleClick()}
                    >
                      {data.call}
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
                    </a>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ExamModal;
