import { Schema, model } from 'mongoose';

const WeatherSummarySchema = new Schema({
    city: String,
    date: { type: Date, required: true },
    averageTemperature: Number,
    maxTemperature: Number,
    minTemperature: Number,
    humidity: Number,
    windSpeed: Number,
    pressure: Number,
    description: String,
    dominantWeather: String,
    feelsLike: Number,
    forecast: [{
        date: Date,
        temperature: Number,
        description: String,
        humidity: Number,
        windSpeed: Number,
        pressure: Number
    }]
});

const WeatherSummary = model('WeatherSummary', WeatherSummarySchema);
export default WeatherSummary;
