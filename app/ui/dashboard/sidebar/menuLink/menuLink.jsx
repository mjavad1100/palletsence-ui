'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './menuLink.module.css';

const MenuLink = ({ item }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={`${styles.container} ${isActive ? styles.active : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={styles.icon} aria-hidden="true">
        {item.icon}
      </span>
      <span className={styles.label}>{item.title}</span>
    </Link>
  );
};

export default MenuLink;
