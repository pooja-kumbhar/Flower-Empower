import axios from "axios";

const url = (window.location.hostname === 'localhost')
  ? 'http://localhost:8000/backend/api/'
  : 'https://flower-empower.propulsion-learn.ch/backend/api/';

const API = axios.create({
  baseURL: url,
});

export default API;
