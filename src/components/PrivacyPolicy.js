import React from "react";
import Footer from "../Pages/Footer";
import Navbar from "./Navbar";

const PrivacyPolicy = () => {
    return (
        <>
            <Navbar />
            <section>
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-10">
                                    <h3 className="aboutHead mb-5">Privacy Policy</h3>
                                    <p className="aboutText">
                                        We, as the sole owners of the information collected on this site, only obtain access to and collect information that you voluntarily provide to us through direct contact. We do not sell this information to any third party. Unless you instruct us otherwise, we may contact you via email in the future to inform you about specials, new products or services, or changes to this privacy policy. The app is intended for daily and normal use by individuals, and any commercial use of the app is strictly prohibited.
                                    </p>
                                    <p className="aboutText">
                                        The developer holds no responsibility for any problems or losses faced by the user. The app is guaranteed to be free from viruses, and no code or script has been written to harm your phone or device. The app does not initiate any calls. The developer disclaims any responsibility for damages or losses incurred by the user.
                                    </p>
                                    <p className="aboutText">
                                        The app is designed for learning purposes only, and there is no intention to cause harm, either physically or mentally, to anyone. Users may opt out of any future contacts from us at any time by contacting us via email at app.prideeducare@gmail.com. users can inquire about the data we have about them, request changes or corrections to their data, request deletion of their data, or express concerns about our use of their data.
                                    </p>
                                    <p className="aboutText">
                                        Security measures are in place to protect personal information from misuse, loss, or unauthorized access. While we take every possible precaution, we cannot guarantee that personal information will be immune to unauthorized access. Therefore, we have implemented various safeguards to secure customers' personal information.
                                    </p>
                                    <p className="aboutText">
                                        We may also collect non-personal information, such as data that does not directly identify any specific individual. This non-personal data is collected, used, transferred, and disclosed for various purposes, including the use of cookies and other technologies to gain a better understanding of our users' needs. Information collected from cookies is utilized to enhance users' experience and the overall quality of our services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

        </>
    );
};

export default PrivacyPolicy;
