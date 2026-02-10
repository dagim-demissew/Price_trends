import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, BarChart3, Clock, RefreshCw } from 'lucide-react';

// Define types for our data
interface StockData {
  Date: string;
  AAPL?: number;
  MSFT?: number;
  GOOGL?: number;
  AMZN?: number;
  TSLA?: number;
  [key: string]: string | number | undefined;
}

const stockColors: Record<string, string> = {
  AAPL: "#00ff88", 
  MSFT: "#00bfff", 
  GOOGL: "#ff0055", 
  AMZN: "#ff9900", 
  TSLA: "#ffffff"
};

const Home: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/trends');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen w-full bg-[#131722] text-[#d1d4dc] flex flex-col font-mono overflow-hidden">
      
      {/* TOP NAV */}
      <nav className="h-[45px] border-b border-[#363a45] flex items-center px-5 justify-between bg-[#131722] shrink-0">
        <div className="flex items-center gap-4">
          <Activity size={18} className="text-[#2962ff]" />
          <span className="font-bold text-white tracking-tighter text-sm">MAYERFELD_TERMINAL_V1</span>
          <div className="hidden md:flex gap-4 ml-5">
            {Object.entries(stockColors).map(([ticker, color]) => (
              <span key={ticker} style={{ color }} className="text-[11px] font-bold">
                {ticker}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#787b86]">
          <span>1D • INDEX:100</span>
          <span className="text-[#00ff88] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
            LIVE
          </span>
          <button onClick={fetchData} className="hover:text-white transition-colors">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </nav>

      <div className="flex-1 flex min-h-0">
        {/* SIDEBAR */}
        <aside className="w-[45px] border-r border-[#363a45] flex flex-col items-center py-5 gap-6 text-[#787b86] shrink-0">
          <BarChart3 size={20} className="hover:text-white cursor-pointer" />
          <Clock size={20} className="hover:text-white cursor-pointer" />
        </aside>

        {/* CHART CONTAINER */}
        <main className="flex-1 relative p-2 overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-[#2962ff] text-xs tracking-widest animate-pulse">
              INITIALIZING DATA FEED...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="#2a2e39" vertical={true} />
                <XAxis 
                  dataKey="Date" 
                  stroke="#787b86" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  orientation="right" 
                  stroke="#787b86" 
                  fontSize={10} 
                  domain={['auto', 'auto']} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e222d', 
                    border: '1px solid #363a45', 
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#d1d4dc'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                  cursor={{ stroke: '#5d606b', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <ReferenceLine 
                  y={100} 
                  stroke="#5d606b" 
                  strokeDasharray="3 3" 
                  label={{ value: 'BASE', fill: '#5d606b', fontSize: 10, position: 'insideLeft' }} 
                />
                {Object.keys(stockColors).map(ticker => (
                  <Line 
                    key={ticker} 
                    type="monotone" 
                    dataKey={ticker} 
                    stroke={stockColors[ticker]} 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="h-[30px] border-t border-[#363a45] flex items-center px-4 text-[10px] text-[#787b86] justify-between shrink-0 bg-[#131722]">
        <div className="flex gap-4">
          <span>MARKET STATUS: <span className="text-[#00ff88]">OPEN</span></span>
          <span className="hidden sm:inline">UTC+3:00</span>
        </div>
        <div className="tracking-widest">YF_API_INTEGRATION_ACTIVE</div>
      </footer>
    </div>
  );
};

export default Home;