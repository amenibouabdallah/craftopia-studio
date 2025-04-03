// filepath: c:\Users\ameny\Documents\GitHub\craftopia-studio\src\utils\unsplash.ts
import axios from "axios";

const UNSPLASH_ACCESS_KEY = "yk62Gppy4vhuLP65dBj0PAlTWIqIFplxyghx7vXDIVA"; // Replace with your Unsplash Access Key

export const searchUnsplashImages = async (query: string, page: number = 1, perPage: number = 10) => {
  const response = await axios.get("https://api.unsplash.com/search/photos", {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
    params: {
      query,
      page,
      per_page: perPage,
    },
  });
  return response.data.results;
};