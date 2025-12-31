export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌐</h1>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        You're Offline
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: '500px' }}>
        WeatherFlow needs an internet connection to fetch the latest weather data.
        Please check your connection and try again.
      </p>
    </div>
  );
}