'use client';

import React, { useState, useEffect } from 'react';
import styles from './sidebar.module.css';
import Image from 'next/image';
import { MdDashboard, MdLogout } from 'react-icons/md';
import { FaArchive, FaCamera } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import MenuLink from '@/app/ui/dashboard/sidebar/menuLink/menuLink';
import { FiMenu } from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
      else setIsOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: <MdDashboard /> },
    { title: 'Archive', path: '/dashboard/archive', icon: <FaArchive /> },
    { title: 'Camera Config', path: '/dashboard/camera', icon: <FaCamera /> },
    { title: 'System Settings', path: '/dashboard/settings', icon: <IoSettings /> },
  ];

  return (
    <>
      {isMobile && (
        <button
          className={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <FiMenu size={24} />
        </button>
      )}

      <div
        className={`${styles.container} ${isOpen ? styles.open : styles.closed}`}
        onClick={() => isMobile && setIsOpen(false)} // Close sidebar on overlay click if mobile
      >
        <div className={styles.user}>
          <Image src="/noavatar.png" alt="User Avatar" width={120} height={120} className={styles.userImage} />
          <div className={styles.userDetails}>
            <div className={styles.username}>Test test</div>
            <div className={styles.userTitle}>Admin</div>
          </div>
        </div>

        <ul className={styles.menu}>
          {menuItems.map(item => (
            <li key={item.title}>
              <MenuLink item={item} />
            </li>
          ))}
        </ul>

        <button className={styles.logout}>
          <MdLogout />
          Logout
        </button>
      </div>

      {/* Optional overlay when sidebar open on mobile */}
      {isMobile && isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
