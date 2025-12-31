import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    
    // Validate city parameter
    if (!city || city.trim() === '') {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }
    
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    // Validate API key
    if (!API_KEY) {
      console.error('OPENWEATHER_API_KEY is missing');
      return NextResponse.json(
        { error: 'Service configuration error' },
        { status: 500 }
      );
    }
    
    // Only fetch current weather (simplify)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    const data = await response.json();
    
    // Check if OpenWeather returned error
    if (!response.ok || data.cod !== 200) {
      return NextResponse.json(
        { 
          error: 'City not found',
          message: data.message || `Could not find weather for "${city}"`
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Weather API error:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Service temporarily unavailable',
        message: 'Weather service is down. Please try again later.'
      },
      { status: 503 } // Use 503 Service Unavailable instead of 500
    );
  }
}