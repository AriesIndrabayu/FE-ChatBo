import axios from "axios";
import { API_BASE_URL, API_BASE_LOGIN } from "../config/env";

// ---- API Bot ----
export const botApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// ---- API Login ----
export const authApi = axios.create({
  baseURL: API_BASE_LOGIN,
  timeout: 15000,
});
