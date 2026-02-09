import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching from your FastAPI backend
    fetch('http://127.0.0.1:8000/api/trends')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const stockColors = {
    AAPL: "#8884d8",
    MSFT: "#82ca9d",
    GOOGL: "#ffc658",
    AMZN: "#ff7300",
    TSLA: "#f50057"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-10 border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">Mayerfeld Insights Dashboard</h1>
        <p className="text-slate-500">Market Trend Analysis | Software Engineering & Data Engineering Project</p>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading && <div className="text-center py-20 text-xl text-blue-600">Analyzing Market Data...</div>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error} (Make sure your FastAPI server is running)
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Normalized Tech Stock Growth (Last 30 Days)</h2>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="Date" 
                    tick={{fontSize: 12}} 
                    interval={Math.floor(data.length / 5)}
                  />
                  <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} label={{ value: 'Normalized %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  {Object.keys(stockColors).map((ticker) => (
                    <Line
                      key={ticker}
                      type="monotone"
                      dataKey={ticker}
                      stroke={stockColors[ticker]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase">Analysis Focus</h3>
                <p className="text-lg font-semibold text-slate-800">Trend Normalization</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase">Tech Stack</h3>
                <p className="text-lg font-semibold text-slate-800">FastAPI, Pandas, React</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 uppercase">Data Source</h3>
                <p className="text-lg font-semibold text-slate-800">Yahoo Finance API</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;