'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip,
  ComposedChart // این خط اضافه شده
} from 'recharts';
import { motion } from 'framer-motion';
import styles from '@/app/ui/dashboard/card/card.module.css';

// بقیه کد بدون تغییر...

const INDUSTRIAL_COLORS = ['var(--primary)', '#ff6b35', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const generateIndustrialData = (type, target) => {
  const baseValue = target || 1000;
  
  switch(type) {
    case 'production':
      return Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        output: Math.floor(baseValue * (0.5 + 0.5 * Math.sin(i * Math.PI / 12))),
        efficiency: Math.floor(70 + 30 * Math.random())
      }));
    case 'quality':
      return [
        { name: 'OK', value: baseValue * 0.85 },
        { name: 'Minor Defects', value: baseValue * 0.1 },
        { name: 'Major Defects', value: baseValue * 0.05 }
      ];
    case 'energy':
      return Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        consumption: Math.floor(baseValue * (0.6 + 0.4 * Math.random()))
      }));
    default:
      return Array.from({ length: 10 }, (_, i) => ({
        time: `${i}:00`,
        value: Math.floor(baseValue * (0.5 + 0.5 * Math.random()))
      }));
  }
};

const card = ({ item }) => {
  const targetValue = useRef(item.value || 0);
  const [displayValue, setDisplayValue] = useState(0);
  const [chartData, setChartData] = useState([]);
  const animationRef = useRef(null);

  // تابع برای فرمت کردن اعداد صنعتی
  const formatIndustrialValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // انیمیشن شمارنده
  useEffect(() => {
    const target = item.value || 0;
    targetValue.current = target;
    setDisplayValue(0);

    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = progress * target;
      
      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [item.value]);

  // تولید داده‌های نمودار
  useEffect(() => {
    setChartData(generateIndustrialData(item.chartType, item.value));
  }, [item.chartType, item.value]);

  // رندر نمودار بر اساس نوع
  const renderIndustrialChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 10, bottom: 10 }
    };

    const tooltipStyle = {
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '0.8rem'
    };

    switch(item.chartType) {
      case 'production':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar 
              yAxisId="left"
              dataKey="output" 
              fill={INDUSTRIAL_COLORS[0]} 
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone"
              dataKey="efficiency"
              stroke={INDUSTRIAL_COLORS[1]}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        );
      case 'quality':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              innerRadius={30}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={INDUSTRIAL_COLORS[index % INDUSTRIAL_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        );
      case 'energy':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={INDUSTRIAL_COLORS[4]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={INDUSTRIAL_COLORS[4]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="consumption"
              stroke={INDUSTRIAL_COLORS[4]}
              fillOpacity={1}
              fill="url(#colorEnergy)"
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="value"
              fill={INDUSTRIAL_COLORS[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.content}>
          {formatIndustrialValue(displayValue)}
          {item.unit && <span className={styles.unit}> {item.unit}</span>}
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          {renderIndustrialChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default card;