import React from "react";
import { Image } from "react-bootstrap";
import Twitter from "../assets/Twitter.svg";
import Linkedin from "../assets/linkedin-1.svg";
import fackbook from "../assets/fb.svg";
import Instagram from "../assets/instagram.svg";
// import { useHistory } from 'react-router-dom'

const Footer = () => {
  // const history = useHistory()
  return <footer className="footer-section">
    <div className="container">
      <div className="footer-wrapper">
        <div className="footer-box">
          <h6 className=" fs-28-18 mb-2 lato-regular white">Contact Us</h6>
          <p className=" fs-16-12 lato-regular pointer white">
            <a href="tel:+917630076300">+91 76300 76300</a> <br />
            <a href="mailto:app.prideeducare@gmail.com">app.prideeducare@gmail.com</a>
          </p>
        </div>
        <div className="footer-box">
          <h6 className=" fs-28-18 mb-2 lato-regular white">Legal</h6>
          <p className=" fs-16-12 lato-regular white pointer">
            <a href="/#/terms-condition">Terms & Conditions</a> <br />
            <a href="/#/privacy-policy">Privacy Policy</a>
          </p>
        </div>
        <div className="footer-box">
          <h6 className=" fs-28-18 mb-2 lato-regular white">Social Media</h6>
          <div className="icons-wrapper">
            <a rel="noreferrer" href="https://www.facebook.com/prideeducare" target="_blank">
              <Image src={fackbook} alt="icon" />
            </a>
            <a rel="noreferrer" href="https://www.instagram.com/pride_computers_education" target="_blank">
              <Image src={Instagram} alt="icon" />
            </a>
            <a rel="noreferrer" href="https://x.com/PrideEducare" target="_blank">
              <Image src={Twitter} alt="icon" />
            </a>
            <a rel="noreferrer" href="https://www.linkedin.com/in/pride-computer-education" target="_blank">
              <Image src={Linkedin} alt="icon" />
            </a>
          </div>
        </div>
      </div>
      <p className="copy-right fx-14 lato-regular white text-center">
      Pride Educare Pvt. Ltd. Copyright {new Date().getFullYear()}
      </p>

    </div>
  </footer>;
}

export default Footer;

