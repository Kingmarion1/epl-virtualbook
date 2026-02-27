import axios from "axios";

const API = axios.create({
  baseURL: "https://epl-virtualbook.onrender.com/api"
});

export default API;
