import _axios from "axios";

export const axios = _axios.create({
  baseURL: "https://cmms.ai/api/v3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `api-key ${process.env.API_KEY}`,
  },
});
