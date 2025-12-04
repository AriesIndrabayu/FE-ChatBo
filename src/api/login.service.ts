// src/api/login.service.ts
import axios from "axios";
import { API_BASE_LOGIN } from "../config/env";

export const loginRequest = async (email: string, password: string) => {
  const res = await axios.post(
    `${API_BASE_LOGIN}Service/UsersChat/loginBackend`,
    { Email: email, password }
  );
  return res.data;
};
