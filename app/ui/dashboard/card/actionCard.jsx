'use client';

import React, { useState, useEffect, useRef } from "react";
import { FaCogs } from "react-icons/fa";
import styles from "./action.module.css";

const ActionCard = ({ name }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [progress, setProgress] = useState(0);
  const [finalNumber, setFinalNumber] = useState(null);
  const intervalRef = useRef(null);

  const startProcess = () => {
    if (loading) return;
    setLoading(true);
    setStatus("Processing...");
    setProgress(0);
    setFinalNumber(null);

    // انیمیشن افزایش عدد تا نامحدود (یا تا 99)
    intervalRef.current = setInterval(() => {
      setProgress(prev => (prev >= 99 ? 0 : prev + 1));
    }, 30);

    // شبیه‌سازی پروسس اصلی
    setTimeout(() => {
      clearInterval(intervalRef.current);
      const success = Math.random() > 0.1; // 90% احتمال موفقیت
      setStatus(success ? "Command Sent" : "Error");
      setLoading(false);
      setFinalNumber(Math.floor(Math.random() * 1000)); // عدد نهایی تصادفی
      setProgress(0);
    }, 3500);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className={`${styles.container} ${loading ? styles.shake : ""}`}
      role="button"
      tabIndex={0}
      onClick={startProcess}
      onKeyDown={e => { if (e.key === "Enter") startProcess(); }}
      aria-busy={loading}
      aria-label={`Action card for ${name}, status: ${status}`}
    >
      <div className={styles.header}>
        <FaCogs className={`${styles.icon} ${loading ? styles.bouncing : ""}`} />
        <div className={styles.title}>{name}</div>
      </div>

      <div className={styles.content}>
        {loading ? `${progress}%` : finalNumber !== null ? finalNumber : "—"}
      </div>

      <div className={styles.status}>
        {status}
      </div>

      <button
        className={styles.button}
        onClick={e => {
          e.stopPropagation();
          startProcess();
        }}
        disabled={loading}
        aria-disabled={loading}
      >
        {loading ? "Processing..." : `Activate ${name}`}
      </button>
    </div>
  );
};

export default ActionCard;
