'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';

interface ForecastChartProps {
  data: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      icon: string;
      main: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

export default function ForecastChart({ data }: ForecastChartProps) {
  const chartData = data.map((item, index) => ({
    time: format(new Date(item.dt * 1000), 'h a'),
    fullTime: format(new Date(item.dt * 1000), 'h:mm a'),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    wind: item.wind.speed,
    icon: item.weather[0].icon,
    condition: item.weather[0].main,
    isNow: index === 0,
  }));

  const averageTemp = chartData.reduce((sum, item) => sum + item.temp, 0) / chartData.length;
  const maxTemp = Math.max(...chartData.map(item => item.temp));
  const minTemp = Math.min(...chartData.map(item => item.temp));

  return (
    <div className="w-full space-y-8">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">
              Projected Timeline
            </h3>
            <p className="text-sm text-gray-300">Next 5 hours • Real-time updates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Avg Temp</p>
            <p className="text-xl font-bold">{Math.round(averageTemp)}°</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Range</p>
            <p className="text-xl font-bold">{minTemp}°-{maxTemp}°</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(59, 130, 246, 0.15)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="rgba(59, 130, 246, 0.15)" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              label={{ value: '°C', angle: -90, position: 'insideLeft' }}
            />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-darker p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                      <p className="text-sm font-bold text-white">{`${payload[0].value}°C`}</p>
                      <p className="text-xs text-gray-400">{payload[0].payload.time}</p>
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-xs text-gray-400">
                          Feels like: {payload[0].payload.feelsLike}°C
                        </p>
                        <p className="text-xs text-gray-400">
                          Humidity: {payload[0].payload.humidity}%
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Area
              type="monotone"
              dataKey="temp"
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTemp)"
              dot={{ r: 4, fill: 'rgba(59, 130, 246, 0.8)', strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 6, fill: 'rgba(29, 78, 216, 0.8)', strokeWidth: 2, stroke: 'white' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Details */}
      <div className="grid grid-cols-5 gap-3">
        {chartData.map((item, index) => (
          <div 
            key={index} 
            className={`text-center p-4 rounded-2xl transition-all ${
              item.isNow 
                ? 'bg-blue-500/20 border border-blue-500/30' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className={`font-medium ${item.isNow ? 'text-blue-300' : 'text-gray-300'}`}>
              {item.time}
            </div>
            <div className="my-3">
              <img 
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt=""
                className="w-10 h-10 mx-auto"
              />
            </div>
            <div className="text-2xl font-bold text-white">
              {item.temp}°
            </div>
            {item.isNow && (
              <div className="text-xs text-blue-300 font-medium mt-2 px-2 py-1 rounded-full bg-blue-500/20">
                Now
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}