// src/api/login.service.ts
import { authApi } from "./axios"; // gunakan instance yang sudah dibuat

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await authApi.post(
      "Service/UsersChat/loginBackend",
      {
        Email: email,
        password: password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.data.error !== "0") {
      throw new Error(res.data.msg || "Login gagal.");
    }

    // Parse session string JSON
    const session = JSON.parse(res.data.session);

    return {
      ...session,
      raw: res.data,
    };
  } catch (err: any) {
    throw new Error(err.message || "Gagal login");
  }
};
