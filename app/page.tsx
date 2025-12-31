'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (cityName = city) => {
    setError(null);
    
    if (!cityName.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`City "${cityName}" not found. Try another city.`);
        } else if (res.status === 400) {
          throw new Error('Invalid city name. Please check spelling.');
        } else if (res.status === 429) {
          throw new Error('Too many requests. Please wait a moment.');
        } else if (res.status === 500) {
          throw new Error('Weather service is temporarily unavailable.');
        } else {
          throw new Error('Unable to fetch weather data.');
        }
      }
      
      const data = await res.json();
      
      if (data.cod && data.cod !== 200) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
      setWeather(data);
      setCity(cityName);
      
    } catch (error: any) {
      setError(error.message || 'Weather service is currently unavailable.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Quick search suggestions
  const quickSearchCities = ['Tokyo', 'New York', 'London', 'Dubai', 'Mumbai', 'Singapore'];

  return (
    <div className="container" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>
              Weather<span style={{ color: '#60a5fa' }}>Flow</span>
            </h1>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
              AI-Powered Weather Intelligence
            </p>
          </div>
          
          <div suppressHydrationWarning style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span>🕐</span>
            <span style={{ fontFamily: 'monospace', fontSize: '1.25rem' }}>
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              }).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Search */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="Search for a city..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                border: error 
                  ? '1px solid rgba(239, 68, 68, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => fetchWeather()}
              disabled={loading || !city.trim()}
              style={{
                background: city.trim() && !error
                  ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: 600,
                cursor: city.trim() && !error ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid rgba(255,255,255,0.3)', 
                    borderTopColor: 'white', 
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Loading...
                </span>
              ) : 'Search'}
            </button>
          </div>
          
          {/* Quick Search Suggestions */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            flexWrap: 'wrap',
            marginTop: '0.5rem'
          }}>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Try:
            </span>
            {quickSearchCities.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  fetchWeather(c);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <span style={{ fontSize: '1.25rem', marginTop: '0.125rem' }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <p style={{ 
                color: '#f87171', 
                fontWeight: 600, 
                margin: 0,
                fontSize: '1rem'
              }}>
                {error}
              </p>
              <p style={{ 
                color: '#fca5a5', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem', 
                marginBottom: 0 
              }}>
                Try a valid city name or check your spelling
              </p>
            </div>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Weather Display */}
        {weather ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem'
          }}>
            {/* Main Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '1.5rem',
              padding: '2rem',
              animation: 'slideUp 0.5s ease-out'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '5rem', fontWeight: 'bold', display: 'flex', alignItems: 'baseline' }}>
                    {Math.round(weather.main.temp)}°
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      style={{ width: '80px', height: '80px', marginLeft: '0.5rem' }}
                    />
                  </div>
                  <p style={{ 
                    color: '#94a3b8', 
                    textTransform: 'capitalize',
                    fontSize: '1.125rem',
                    marginTop: '0.5rem'
                  }}>
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'transform 0.2s'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Feels Like</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {Math.round(weather.main.feels_like)}°
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'transform 0.2s'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Humidity</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {weather.main.humidity}%
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'transform 0.2s'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Wind</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {weather.wind.speed} m/s
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  transition: 'transform 0.2s'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Pressure</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {weather.main.pressure} hPa
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Welcome Message - No weather data yet */
          !error && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1.5rem',
              padding: '4rem 2rem',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              <div style={{ fontSize: '5rem', marginBottom: '1rem', opacity: 0.8 }}>
                🌤️
              </div>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                background: 'linear-gradient(90deg, #60a5fa, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Welcome to WeatherFlow
              </h2>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '1.125rem', 
                maxWidth: '500px', 
                margin: '0 auto',
                lineHeight: 1.6
              }}>
                Discover accurate weather forecasts for any location worldwide.
                Get temperature, humidity, wind speed, and pressure data instantly.
              </p>
            </div>
          )
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.875rem',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p>Powered by OpenWeatherMap • Real-time data</p>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
          /* Mobile responsive scaling */
@media (max-width: 768px) {
  .container {
    transform: scale(0.85);
    transform-origin: top center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    transform: scale(0.75);
    transform-origin: top center;
    width: 100%;
  }
}
      `}</style>
    </div>
  );
}