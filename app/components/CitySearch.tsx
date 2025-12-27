'use client';

import { Search, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CitySearchProps {
  onSearch: (city: string) => void;
  currentCity: string;
}

const POPULAR_CITIES = [
  { name: 'London', country: 'UK', emoji: '🇬🇧' },
  { name: 'New York', country: 'US', emoji: '🇺🇸' },
  { name: 'Tokyo', country: 'JP', emoji: '🇯🇵' },
  { name: 'Paris', country: 'FR', emoji: '🇫🇷' },
  { name: 'Delhi', country: 'IN', emoji: '🇮🇳' },
  { name: 'Mumbai', country: 'IN', emoji: '🇮🇳' },
  { name: 'Sydney', country: 'AU', emoji: '🇦🇺' },
  { name: 'Dubai', country: 'AE', emoji: '🇦🇪' },
];

export default function CitySearch({ onSearch, currentCity }: CitySearchProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    // Initialize input with currentCity
    setInput(currentCity);
    
    // Load recent searches from localStorage
    const saved = localStorage.getItem('weatherRecentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, [currentCity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    
    // Add to recent searches
    const updatedRecent = [input, ...recentSearches.filter(s => s !== input)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('weatherRecentSearches', JSON.stringify(updatedRecent));
    
    await onSearch(input.trim());
    setLoading(false);
    setShowRecent(false);
  };

  const handleQuickSearch = (city: string) => {
    setInput(city);
    onSearch(city);
    setShowRecent(false);
  };

  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowRecent(true)}
          onBlur={() => setTimeout(() => setShowRecent(false), 200)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-12 py-4 glass border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 text-base bg-white/5 backdrop-blur-sm"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </form>

      {/* Recent & Popular Cities Dropdown */}
      {(showRecent && (recentSearches.length > 0 || POPULAR_CITIES.length > 0)) && (
        <div className="absolute top-full mt-2 w-full glass-darker border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <>
              <div className="px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Recent Searches</span>
                </div>
              </div>
              <div className="py-2">
                {recentSearches.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(city)}
                    className="w-full px-4 py-3 hover:bg-white/5 text-left flex items-center gap-3 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <span className="text-white">{city}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Popular Cities */}
          <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>Popular Cities</span>
            </div>
          </div>
          <div className="py-2">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => handleQuickSearch(city.name)}
                className="w-full px-4 py-3 hover:bg-white/5 text-left flex items-center gap-3 transition-colors group"
              >
                <span className="text-lg">{city.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{city.name}</span>
                  <span className="text-xs text-gray-400">{city.country}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}