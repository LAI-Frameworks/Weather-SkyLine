'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async (cityName = city) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${cityName}`);
      const data = await res.json();
      setWeather(data);
      setCity(cityName);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
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
              Professional Weather Dashboard
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
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="Search for a city..."
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={() => fetchWeather()}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['London', 'New York', 'Tokyo', 'Paris'].map((c) => (
              <button
                key={c}
                onClick={() => fetchWeather(c)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Weather Display */}
        {weather && (
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
              padding: '2rem'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                    {weather.name}
                  </h2>
                  <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '5rem', fontWeight: 'bold' }}>
                    {Math.round(weather.main.temp)}°
                  </div>
                  <p style={{ color: '#94a3b8', textTransform: 'capitalize' }}>
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
                  padding: '1.5rem'
                }}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Feels Like</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {Math.round(weather.main.feels_like)}°
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Humidity</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {weather.main.humidity}%
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Wind</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {weather.wind.speed} m/s
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Pressure</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {weather.main.pressure} hPa
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}