'use client';

import { Search, MapPin, Clock, ChevronRight, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CitySearchProps {
  onSearch: (city: string) => void;
  currentCity: string;
}

const CONTINENTS = [
  {
    name: 'Africa',
    emoji: '🌍',
    color: 'from-green-900/20 to-green-700/20',
    cities: ['Cairo', 'Cape Town', 'Nairobi', 'Lagos', 'Johannesburg']
  },
  {
    name: 'Asia',
    emoji: '🌏',
    color: 'from-yellow-900/20 to-yellow-700/20',
    cities: ['Tokyo', 'Delhi', 'Shanghai', 'Singapore', 'Dubai', 'Seoul']
  },
  {
    name: 'Europe',
    emoji: '🇪🇺',
    color: 'from-blue-900/20 to-blue-700/20',
    cities: ['London', 'Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam']
  },
  {
    name: 'North America',
    emoji: '🌎',
    color: 'from-red-900/20 to-red-700/20',
    cities: ['New York', 'Los Angeles', 'Toronto', 'Mexico City', 'Chicago', 'Miami']
  },
  {
    name: 'South America',
    emoji: '🇧🇷',
    color: 'from-purple-900/20 to-purple-700/20',
    cities: ['São Paulo', 'Buenos Aires', 'Rio de Janeiro', 'Lima', 'Bogotá', 'Santiago']
  },
  {
    name: 'Oceania',
    emoji: '🇦🇺',
    color: 'from-cyan-900/20 to-cyan-700/20',
    cities: ['Sydney', 'Melbourne', 'Auckland', 'Perth', 'Brisbane', 'Wellington']
  }
];

export default function CitySearch({ onSearch, currentCity }: CitySearchProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showContinents, setShowContinents] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  useEffect(() => {
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
    setShowContinents(false);
    setSelectedContinent(null);
  };

  const handleQuickSearch = (city: string) => {
    setInput(city);
    onSearch(city);
    setShowContinents(false);
    setSelectedContinent(null);
  };

  const handleContinentClick = (continentName: string) => {
    setSelectedContinent(continentName);
  };

  const handleBackToContinents = () => {
    setSelectedContinent(null);
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
          onFocus={() => setShowContinents(true)}
          onBlur={() => setTimeout(() => setShowContinents(false), 200)}
          placeholder="Search for a city or select a continent..."
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

      {/* Continents & Cities Dropdown */}
      {showContinents && (
        <div className="absolute top-full mt-2 w-full glass-darker border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in">
          {/* Recent Searches */}
          {recentSearches.length > 0 && !selectedContinent && (
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

          {/* Back Button when continent is selected */}
          {selectedContinent && (
            <div className="px-4 py-3 border-b border-white/5">
              <button
                onClick={handleBackToContinents}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Continents
              </button>
            </div>
          )}

          {/* Continents Grid */}
          {!selectedContinent ? (
            <>
              <div className="px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
                  <Globe className="w-3 h-3" />
                  <span>Explore by Continent</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {CONTINENTS.map((continent) => (
                  <button
                    key={continent.name}
                    onClick={() => handleContinentClick(continent.name)}
                    className={`p-4 rounded-xl bg-gradient-to-br ${continent.color} border border-white/10 hover:border-white/30 transition-all hover:scale-105 flex flex-col items-center justify-center gap-2`}
                  >
                    <span className="text-3xl">{continent.emoji}</span>
                    <span className="text-white font-medium text-sm">{continent.name}</span>
                    <span className="text-xs text-gray-400">{continent.cities.length} cities</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Cities in Selected Continent */
            <div className="py-2">
              <div className="px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-lg">
                    {CONTINENTS.find(c => c.name === selectedContinent)?.emoji}
                  </span>
                  <span>Major cities in {selectedContinent}</span>
                </div>
              </div>
              <div className="py-2">
                {CONTINENTS.find(c => c.name === selectedContinent)?.cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleQuickSearch(city)}
                    className="w-full px-4 py-3 hover:bg-white/5 text-left flex items-center gap-3 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    <span className="text-white">{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Search Examples */}
          {!selectedContinent && (
            <>
              <div className="px-4 py-3 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
                  <Search className="w-3 h-3" />
                  <span>Quick Search</span>
                </div>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {['London', 'Tokyo', 'New York', 'Paris', 'Dubai', 'Sydney'].map((city) => (
                  <button
                    key={city}
                    onClick={() => handleQuickSearch(city)}
                    className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}