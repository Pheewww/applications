import axios from "axios";

const API_URL = "http://localhost:3001/api/weather"; 

export const getWeatherSummaries = async () => {
  try {
    const response = await axios.get(`${API_URL}/summaries`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather summaries", error);
    return [];
  }
};

export const getLatestWeather = async (city) => {
  try {
    const response = await axios.get(`${API_URL}/latest/${city}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest weather", error);
    throw error;
  }
};
 

export const getCityAggregates = async () => {
  try {
    const response = await axios.get(`${API_URL}/city-aggregates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching city aggregates", error);
    throw error;
  }
};
