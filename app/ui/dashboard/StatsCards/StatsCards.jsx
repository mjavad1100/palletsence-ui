'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './StatsCards.module.css';

const StatsCards = () => {
  // داده‌های ثابت با طراحی پیشرفته
  const cardsData = [
    {
      id: 1,
      title: "Users",
      value: 144000,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      trend: "12% increase",
      change: "increase",
      description: "Active monthly users"
    },
    {
      id: 2,
      title: "Conversions",
      value: 325000,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      ),
      trend: "8.5% increase",
      change: "increase",
      description: "Successful transactions"
    },
    {
      id: 3,
      title: "Event count",
      value: 200000,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      trend: "3.2% increase",
      change: "increase",
      description: "Monthly activities"
    }
  ];
  
  const [cards, setCards] = useState(cardsData);
  const [loading, setLoading] = useState(false);
  
  // شبیه‌سازی به‌روزرسانی داینامیک داده‌ها
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      
      setTimeout(() => {
        const updatedData = cards.map(card => {
          const randomChange = Math.random() > 0.3 ? "increase" : "decrease";
          const randomValue = Math.floor(Math.random() * 1000);
          
          return {
            ...card,
            value: card.value + (randomChange === "increase" ? randomValue : -randomValue),
            trend: `${(Math.random() * 10).toFixed(1)}% ${randomChange}`,
            change: randomChange
          };
        });
        
        setCards(updatedData);
        setLoading(false);
      }, 800);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [cards]);

  const formatNumber = (num) => {
    return num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num.toString();
  };

  // انیمیشن‌ها
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className={styles.cardsContainer}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div 
          key={card.id}
          className={`${styles.card} ${loading ? styles.pulse : ''}`}
          variants={item}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} data-change={card.change}>
              {card.icon}
            </div>
            <div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div className={styles.cardDescription}>{card.description}</div>
            </div>
          </div>
          
          <div className={styles.cardValueContainer}>
            <p className={styles.cardValue}>{formatNumber(card.value)}</p>
            <div className={`${styles.cardTrend} ${styles[card.change]}`}>
              <span className={styles.trendArrow}>
                {card.change === "increase" ? "↑" : "↓"}
              </span>
              <span>{card.trend}</span>
            </div>
          </div>
          
          <div className={styles.cardFooter}>
            <div className={styles.cardProgressLabel}>
              <span>Target</span>
              <span>{formatNumber(card.value > 300000 ? 300000 : card.value + 50000)}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;