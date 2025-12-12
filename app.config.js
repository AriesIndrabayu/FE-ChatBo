import "dotenv/config";

export default {
  expo: {
    name: "BOT-SIKONDA",
    slug: "bot-sikonda",
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      API_BASE_LOGIN: process.env.API_BASE_LOGIN,
      KEY_API: process.env.KEY_API,
      eas: {
        projectId: "2ee4bd3a-fa92-427f-a4a3-8fb9f1540792",
      },
    },
  },
  experiments: {
    typedRoutes: true, // penting untuk expo-router
  },

  web: {
    bundler: "metro", // WAJIB kalau pakai expo-router
  },
};
