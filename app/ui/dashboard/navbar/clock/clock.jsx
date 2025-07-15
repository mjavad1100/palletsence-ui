'use client'

import React, {useState} from 'react';
import styles from './clock.module.css'
import {format} from 'date-fns';

const Clock = () => {
    let time = new Date().toLocaleTimeString()
    const [ctime, setTime] = useState(time)
    const UpdateTime = () => {
        time = new Date().toLocaleTimeString()
        setTime(time)
    }
    setInterval(UpdateTime)

    return (
        <div className={styles.container}>
            <div className={styles.clock}>
                {ctime}
            </div>
            <div className={styles.date}>{format(new Date(), 'yyyy/MM/dd')}</div>
        </div>
    );
};

export default Clock;