import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface ForecastData {
  list: ForecastItem[];
}

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  try {
    console.log('Fetching weather for:', city);
    const response = await axios.get(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    console.log('Weather response received:', response.data.name);
    return response.data;
  } catch (error: any) {
    console.error('Weather fetch error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchForecast = async (lat: number, lon: number): Promise<ForecastData> => {
  try {
    console.log('Fetching forecast for coordinates:', lat, lon);
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=5`
    );
    console.log('Forecast response received:', response.data.list.length, 'items');
    return response.data;
  } catch (error: any) {
    console.error('Forecast fetch error:', error.response?.data || error.message);
    throw error;
  }
};