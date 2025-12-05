import "dotenv/config";

export default {
  expo: {
    name: "FE-ChatBot",
    slug: "FE-ChatBot",
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      API_BASE_LOGIN: process.env.API_BASE_LOGIN,
      KEY_API: process.env.KEY_API,
    },
  },
};
