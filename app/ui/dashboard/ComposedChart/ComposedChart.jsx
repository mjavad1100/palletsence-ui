'use client';

import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 shadow-lg">
        <p className="font-semibold text-[var(--text)]">{label}</p>
        {payload.map((entry, index) => (
          <p 
            key={index} 
            className="flex items-center"
            style={{ color: entry.color }}
          >
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></span>
            {entry.name}: <span className="font-medium ml-1">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex justify-center space-x-4 pt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <span 
            className="inline-block w-4 h-4 rounded mr-2" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-sm text-[var(--textSoft)]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const ComposedChartCard = ({ title, data, barKey, lineKey, areaKey }) => {
  const barColor = "var(--primary)";
  const lineColor = "#ff6b35";
  
  const maxValue = Math.max(...data.map(item => {
    const values = [];
    if (barKey) values.push(item[barKey]);
    if (lineKey) values.push(item[lineKey]);
    if (areaKey) values.push(item[areaKey]);
    return Math.max(...values);
  }));

  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl relative overflow-hidden group">
      {/* Gradient border element */}
      <div 
        className="absolute top-0 left-0 w-1.5 h-full transition-all duration-300 group-hover:h-4/5"
        style={{
          background: 'linear-gradient(180deg, var(--primary), var(--primaryHover))',
          borderRadius: '1rem 0 0 1rem'
        }}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--text)]">{title}</h2>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded bg-[var(--primary)] mr-2"></div>
            <span className="text-sm text-[var(--textSoft)]">{barKey}</span>
          </div>
          {lineKey && (
            <div className="flex items-center ml-4">
              <div className="w-3 h-3 rounded bg-[#ff6b35] mr-2"></div>
              <span className="text-sm text-[var(--textSoft)]">{lineKey}</span>
            </div>
          )}
          {areaKey && (
            <div className="flex items-center ml-4">
              <div className="w-3 h-3 rounded bg-[#6366f1] mr-2"></div>
              <span className="text-sm text-[var(--textSoft)]">{areaKey}</span>
            </div>
          )}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--border)" 
            opacity={0.5} 
          />
          <XAxis 
            dataKey="name" 
            stroke="var(--textSoft)" 
            tick={{ fill: 'var(--textSoft)', fontSize: 12 }}
          />
          <YAxis 
            stroke="var(--textSoft)" 
            tick={{ fill: 'var(--textSoft)', fontSize: 12 }}
          />
          <ReferenceLine 
            y={maxValue * 0.8} 
            stroke="var(--textSoft)" 
            strokeDasharray="3 3" 
            strokeOpacity={0.3}
            label={{ 
              value: 'Target', 
              position: 'insideTopRight', 
              fill: 'var(--textSoft)',
              fontSize: 12,
              opacity: 0.8
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          
          {areaKey && (
            <Area
              type="monotone"
              dataKey={areaKey}
              fill="url(#areaGradient)"
              stroke="var(--primary)"
              strokeWidth={2}
              name={areaKey}
            />
          )}
          {barKey && (
            <Bar 
              dataKey={barKey} 
              barSize={24} 
              fill={barColor} 
              radius={[4, 4, 0, 0]}
              name={barKey}
            />
          )}
          {lineKey && (
            <Line
              type="monotone"
              dataKey={lineKey}
              stroke={lineColor}
              strokeWidth={3}
              dot={{ stroke: lineColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: lineColor }}
              name={lineKey}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <div className="px-3 py-1 bg-[var(--bg)] text-[var(--textSoft)] text-sm rounded-full border border-[var(--border)]">
          Last 30 days
        </div>
        <div className="px-3 py-1 bg-[var(--bg)] text-[var(--textSoft)] text-sm rounded-full border border-[var(--border)]">
          Real-time
        </div>
        <div className="px-3 py-1 bg-[var(--primary)] text-white text-sm rounded-full hover:bg-[var(--primaryHover)] transition-colors">
          Export Data
        </div>
      </div>
    </div>
  );
};

export default ComposedChartCard;