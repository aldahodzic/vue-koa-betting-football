import Axios from "axios";

const axios = Axios.create({
  baseURL: "/api/v1/",
  withCredentials: false, // Check cross-site Access-Control
});

axios.interceptors.response.use(
  response => ({ data: response.data, status: true }),
  error => Promise.resolve({ data: error.response.data, status: false }),
);

export default axios;
