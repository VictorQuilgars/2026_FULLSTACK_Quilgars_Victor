const defaultApiUrl = "http://localhost:4000/api";

const serverApiUrl =
  process.env.API_URL_SERVER ??
  process.env.NEXT_PUBLIC_API_URL ??
  defaultApiUrl;

const browserApiUrl = process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl;

export const API_URL =
  typeof window === "undefined" ? serverApiUrl : browserApiUrl;
