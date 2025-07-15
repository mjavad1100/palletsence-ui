'use client';
import React, { useEffect, useState } from 'react';
import styles from './navbar.module.css';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaInfoCircle, FaUserCircle } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import dynamic from "next/dynamic";

const Clock = dynamic(() => import("../navbar/clock/clock"), { ssr: false });

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Set class on html element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={styles.container}>
      <Clock />
      <div className={styles.icons}>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
        <IoSettings />
      </div>
    </div>
  );
};

export default Navbar;
