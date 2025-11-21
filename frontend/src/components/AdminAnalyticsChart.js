import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const AdminAnalyticsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/admin/analytics`);
        const result = await res.json();
        if (result && result.rows) {
          const chartData = result.rows.map(row => {
            const dateStr = row.dimensionValues[0].value;
            // Parse date format YYYYMMDD
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            const date = new Date(year, parseInt(month) - 1, day);
            
            return {
              date: dateStr,
              displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              sessions: parseInt(row.metricValues[0].value, 10)
            };
          });
          setData(chartData);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Analytics fetch failed:', err);
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [baseUrl]);

  const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0);
  const avgSessions = data.length > 0 ? Math.round(totalSessions / data.length) : 0;
  const peakSessions = data.length > 0 ? Math.max(...data.map(d => d.sessions)) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-br from-white to-gray-50 px-5 py-4 rounded-xl shadow-2xl border border-emerald-100 backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {payload[0].payload.displayDate}
          </p>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
            {payload[0].value}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">sessions</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full p-8 bg-gradient-to-br from-white via-emerald-50/20 to-white rounded-2xl border border-gray-200 shadow-lg">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-white via-emerald-50/20 to-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header with gradient accent */}
        <div className="relative px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-gradient-to-r from-emerald-500/5 to-transparent">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Website Views</h2>
          <p className="text-sm text-gray-600">Insights from the last 7 days</p>
        </div>

        {/* Stats Cards */}
        {data.length > 0 && (
          <div className="px-6 md:px-8 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Total</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-emerald-900">{totalSessions.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 mt-1">sessions</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Average</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">{avgSessions.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">per day</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Peak</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-purple-900">{peakSessions.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">sessions</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-6 md:mx-8 mb-4 px-5 py-4 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Chart Area */}
        <div className="px-6 md:px-8 pb-6 md:pb-8">
          {data && data.length > 0 ? (
            <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
              <div className="w-full h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 8, right: 8, left: 8, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis 
                      dataKey="displayDate" 
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                      stroke="#d1d5db"
                      tickLine={false}
                      label={{ value: 'Date', position: 'insideBottom', offset: -10, fill: '#4b5563', fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                      stroke="#d1d5db"
                      tickLine={false}
                      label={{ value: 'Sessions', angle: -90, position: 'insideLeft', fill: '#4b5563', fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }} />
                    <Area 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fill="url(#colorSessions)"
                      dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7, fill: '#059669', strokeWidth: 3, stroke: '#fff' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center px-4">
                <div className="relative inline-block">
                  <svg className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-700">No Data Available Yet</p>
                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                  Your analytics dashboard is ready. Data will populate here as visitors interact with your site.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsChart;