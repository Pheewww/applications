import axios from 'axios';
import WeatherSummary from '../models/weatherSummary';
import dotenv from 'dotenv';

dotenv.config();

export const fetchWeatherData = async (city: string) => {
    try {
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            axios.get(currentWeatherUrl),
            axios.get(forecastUrl)
        ]);

        const currentData = currentWeatherResponse.data;
        const forecastData = forecastResponse.data;

        console.log("feels like object", currentData);

        const forecast = forecastData.list.slice(0, 5).map((item: any) => ({
            date: new Date(item.dt * 1000),
            temperature: item.main.temp,
            description: item.weather[0].main,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            pressure: item.main.pressure
        }));

        const summary = new WeatherSummary({
            city: currentData.name,
            date: new Date(currentData.dt * 1000),
            averageTemperature: currentData.main.temp,
            maxTemperature: currentData.main.temp_max,
            minTemperature: currentData.main.temp_min,
            humidity: currentData.main.humidity,
            windSpeed: currentData.wind.speed,
            pressure: currentData.main.pressure,
            description: currentData.weather[0].description,
            dominantWeather: currentData.weather[0].main,
            feelsLike: currentData.main.feels_like,
            forecast: forecast
        });

        console.log("feels like in summary", summary);


        await summary.save();
        return summary;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};
