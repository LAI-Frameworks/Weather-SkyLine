import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🌐 API Route called');
    
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || 'London';
    const type = searchParams.get('type') || 'current';
    
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    // Validate API key
    if (!API_KEY) {
      console.error('❌ OPENWEATHER_API_KEY is missing!');
      return NextResponse.json(
        { error: 'API key not configured', message: 'Please check environment variables' },
        { status: 500 }
      );
    }
    
    console.log(`🔍 Fetching ${type} weather for:`, city);
    
    if (type === 'forecast') {
      // Get weather first for coordinates
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!weatherRes.ok) {
        const error = await weatherRes.json();
        throw new Error(error.message || 'City not found');
      }
      
      const weatherData = await weatherRes.json();
      const { lat, lon } = weatherData.coord;
      
      // Then get forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=5`
      );
      
      const forecastData = await forecastRes.json();
      return NextResponse.json(forecastData);
      
    } else {
      // Current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'City not found');
      }
      
      const data = await response.json();
      console.log('✅ Weather data fetched for:', data.name);
      
      return NextResponse.json(data);
    }
    
  } catch (error: any) {
    console.error('❌ API Error:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        message: error.message || 'Unknown error',
        suggestion: 'Check API key and city name'
      },
      { status: 500 }
    );
  }
}