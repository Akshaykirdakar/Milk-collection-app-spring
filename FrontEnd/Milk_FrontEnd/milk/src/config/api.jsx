// eslint-disable-next-line
import AddMilkEntry from "../components/MilkCollection";

export const BASE_URL = `${import.meta.env.VITE_API_URL}/`;

export const API_URLS = {
  getUser: `${BASE_URL}milk/user`,
  // Add more endpoints here
  addUser: `${BASE_URL}milk/user`,
  updateUser: `${BASE_URL}milk/user`,
  addMilkEntry: `${BASE_URL}milk/entry`,
  getMilkCollections: `${BASE_URL}milk/userID/`,
  addMilkRateSlabs: `${BASE_URL}api/rates/slabs/batch`,
  generateMilkRates: `${BASE_URL}api/rates/generate`,
  getmilkrateSlabs: `${BASE_URL}api/rates/slabs`,  
  getMilkRates: `${BASE_URL}api/rates/milk`,
  getMilkCollectionsDateWise: `${BASE_URL}api/reports/milk-collections/date-wise`,
};