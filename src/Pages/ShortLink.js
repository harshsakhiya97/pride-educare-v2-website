import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../helper/axios";
import { AuthContext } from "../context/AuthContext";

const ShortLink = () => {
  const { link } = useParams();
  const { token } = useContext(AuthContext);
  // const navigate = useNavigate();
 
  useEffect(() => {
    getFullLink();
  }, [token]);

  const getFullLink = async () => {
    try {
      const param = { shortLink: link };
      const response = await axios.post("link/getFullLink", param, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data.data.message==""){

      } else {
        window.location.href = response.data.data.message;
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    Please Wait..
    </>
  );
};

export default ShortLink;
