'use client';  // Client for charts/interactivity

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  tier: string;  // 'first' or 'top'
  events: Array<{
    id: string;
    timestamp: string;
    event_type: string;
    metadata: { drop_id: string; amount?: number };
  }>;
}

export function AnalyticsDashboard({ tier, events }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Aggregate data
  const viewCount = events.filter(e => e.event_type === 'drop_view').length;
  const sales = events.filter(e => e.event_type === 'sale');
  const salesTotal = sales.reduce((sum, e) => sum + (e.metadata.amount || 0), 0);
  
  // Simple trend data: group sales by day (example; adjust for your needs)
  const salesData = sales.reduce((acc: { [date: string]: number }, e) => {
    const date = new Date(e.timestamp).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + (e.metadata.amount || 0);
    return acc;
  }, {});
  const chartData = Object.entries(salesData).map(([date, amount]) => ({ date, amount }));

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Analytics Dashboard</h1>
        
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>Overview</button>
          <button onClick={() => setActiveTab('sales')} className={`px-4 py-2 rounded ${activeTab === 'sales' ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>Sales</button>
          {tier === 'top' && <button onClick={() => setActiveTab('advanced')} className={`px-4 py-2 rounded ${activeTab === 'advanced' ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>Advanced</button>}
          <button onClick={() => setActiveTab('tutorials')} className={`px-4 py-2 rounded ${activeTab === 'tutorials' ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>Marketing Tutorials</button>
        </div>

        {activeTab === 'overview' && (
          <div>
            <p className="text-2xl mb-4">Total Views: {viewCount}</p>
            <p className="text-2xl mb-4">Total Sales: ${salesTotal}</p>
            {/* Add Vercel Analytics summary if integrated */}
          </div>
        )}

        {activeTab === 'sales' && (
          <div>
            <h2 className="text-2xl mb-4">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'advanced' && tier === 'top' && (
          <div>
            <h2 className="text-2xl mb-4">Advanced Insights</h2>
            <p>Geo breakdowns, predictions, etc. (Placeholder – expand with more queries)</p>
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div>
            <h2 className="text-2xl mb-4">Marketing Tutorials</h2>
            <ul className="list-disc pl-6">
              <li>Tutorial 1: SEO Basics (Embed video/link or Markdown)</li>
              <li>Tutorial 2: Social Media Promo (Gated content for tiers)</li>
              {/* Add more; store in Supabase or static files */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
