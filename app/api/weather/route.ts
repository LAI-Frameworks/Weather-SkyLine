import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather, fetchForecast } from '@/lib/weatherService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || 'London';
  const type = searchParams.get('type') || 'current';

  try {
    console.log('API Route called with:', { city, type });
    
    if (type === 'forecast') {
      // For forecast, first get weather to get coordinates
      const weatherData = await fetchWeather(city);
      const forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon);
      
      return NextResponse.json(forecastData);
    } else {
      // For current weather
      const weatherData = await fetchWeather(city);
      return NextResponse.json(weatherData);
    }
  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        message: error.response?.data?.message || 'City not found or API error'
      },
      { status: error.response?.status || 500 }
    );
  }
}