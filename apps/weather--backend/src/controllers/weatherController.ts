import { Request, Response } from 'express';
import WeatherSummary from '../models/weatherSummary';
import { fetchWeatherData } from '../services/weatherService';

export const getDailySummaries = async (req: Request, res: Response) => {
    try {
        const summaries = await WeatherSummary.find();
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getLatestWeather = async (req: Request, res: Response) => {
    try {
        const { city } = req.params;
        if (!city) {
            return res.status(400).json({ message: 'City parameter is required' });
        }
        const latestWeather = await fetchWeatherData(city);
        res.json(latestWeather);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getDailyAggregates = async (req: Request, res: Response) => {
    try {
        const { city } = req.params;
        if (!city) {
            return res.status(400).json({ message: 'City parameter is required' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const aggregates = await WeatherSummary.aggregate([
            { $match: { city: city, date: { $gte: today } } },
            {
                $group: {
                    _id: null,
                    averageTemperature: { $avg: "$averageTemperature" },
                    maxTemperature: { $max: "$maxTemperature" },
                    minTemperature: { $min: "$minTemperature" },
                }
            }
        ]);

        if (aggregates.length === 0) {
            return res.status(404).json({ message: 'No data found for the specified city' });
        }

        const result = aggregates[0];
        const dominantWeatherObj = await getDominantWeather(city, today);
        result.dominantWeatherCondition = dominantWeatherObj.condition;
        result.dominantWeatherReason = dominantWeatherObj.reason;
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getCityAggregates = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const aggregates = await WeatherSummary.aggregate([
            { $match: { date: { $gte: today } } },
            {
                $group: {
                    _id: "$city",
                    averageTemperature: { $avg: "$averageTemperature" },
                    maxTemperature: { $max: "$maxTemperature" },
                    minTemperature: { $min: "$minTemperature" },
                }
            }
        ]);

        const result = await Promise.all(aggregates.map(async (city) => {
            const dominantWeather = await getDominantWeather(city._id, today);
            return {
                name: city._id,
                averageTemperature: city.averageTemperature,
                maxTemperature: city.maxTemperature,
                minTemperature: city.minTemperature,
                dominantWeather: dominantWeather.condition,
                dominantWeatherReason: dominantWeather.reason
            };
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

async function getDominantWeather(city: string, date: Date) {
    const weatherCounts = await WeatherSummary.aggregate([
        { $match: { city: city, date: { $gte: date } } },
        { $group: { _id: "$dominantWeather", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    if (weatherCounts.length > 0) {
        return {
            condition: weatherCounts[0]._id,
            reason: `Occurred ${weatherCounts[0].count} times today`
        };
    }

    return { condition: "Unknown", reason: "No data available" };
}
