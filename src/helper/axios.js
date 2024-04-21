import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:8080/api/v1/app/",
  // baseURL: "http://3.111.138.176:8080/PrideServer/api/v1/app/",
  baseURL: "https://api.pridecomputer.com:8443/PrideServer/api/v1/app/",
  headers: {
    "Content-Type": "application/json",
  },
});
