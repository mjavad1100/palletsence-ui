'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import styles from '@/app/ui/dashboard/card/card.module.css';

const COLORS = ['#6366f1', '#8b5cf6', '#4f46e5', '#7c3aed', '#a78bfa', '#c4b5fd'];

const generateData = (type, target) => {
  switch(type) {
    case 'radar':
      return [
        { name: 'A', value: target * 0.8 },
        { name: 'B', value: target * 0.6 },
        { name: 'C', value: target * 0.9 },
        { name: 'D', value: target * 0.7 }
      ];
    case 'pie':
      return [
        { name: 'OK', value: target * 0.7 },
        { name: 'Warn', value: target * 0.2 },
        { name: 'Error', value: target * 0.1 }
      ];
    case 'scatter':
      return Array.from({ length: 8 }, () => ({
        x: Math.random() * target,
        y: Math.random() * target
      }));
    default:
      return Array.from({ length: 10 }, (_, i) => ({
        name: `T${i + 1}`,
        value: Math.floor(Math.random() * target * 0.5 + target * 0.5)
      }));
  }
};

const Card = ({ item }) => {
  const targetValue = useRef(parseFloat(item.content) || 0);
  const [display, setDisplay] = useState(0);
  const [data, setData] = useState([]);
  const animRef = useRef(null);

  useEffect(() => {
    const target = parseFloat(item.content) || 0;
    targetValue.current = target;
    setDisplay(0);
    setData(generateData(item.chartType, target));

    const start = performance.now();
    const duration = 1500;
    const step = now => {
      const prog = Math.min((now - start) / duration, 1);
      setDisplay((prog * target).toFixed(1));
      if (prog < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [item.content, item.chartType]);

  const renderChart = () => {
    const common = { data, margin: { top: 0, right: 0, left: 0, bottom: 0 } };
    switch (item.chartType) {
      case 'area':
        return (
          <AreaChart {...common}>
            <defs>
              <filter id="shadowA">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor={COLORS[0]} floodOpacity="0.3"/>
              </filter>
              <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.6}/>
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Area dataKey="value" stroke={COLORS[0]} strokeWidth={2} fill="url(#gradA)" filter="url(#shadowA)" activeDot={{ r:4 }} />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart {...common}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={COLORS[1]} strokeWidth={2.5} dot={false} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...common}>
            <CartesianGrid horizontal={false} vertical={false}/>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill={COLORS[2]} barSize={8} radius={[4,4,0,0]} />
          </BarChart>
        );
      case 'radar':
        return (
          <RadarChart data={data} outerRadius="80%">
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Tooltip />
            <Radar name="Score" dataKey="value" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={0.5} />
          </RadarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={30} innerRadius={15} label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[(i+4)%COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...common}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="x" hide type="number"/>
            <YAxis dataKey="y" hide type="number"/>
            <Tooltip />
            <Scatter dataKey="y" fill={COLORS[5]} />
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div className={styles.container} whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
      <div className={styles.header}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.content}>{display}</div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={90}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Card;
