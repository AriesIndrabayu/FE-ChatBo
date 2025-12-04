import Constants from "expo-constants";

const ENV = Constants?.expoConfig?.extra ?? {};

export const API_BASE_URL = ENV.API_BASE_URL;
export const API_BASE_LOGIN = ENV.API_BASE_LOGIN;
