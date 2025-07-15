'use client'
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import styles from '@/app/ui/dashboard/imageLoader/imageLoader.module.css';


const ImageLoader = () => {
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.container}>
            {!showImage ? (
                <div className={styles.loaderWrapper}>
                    <Loader2 className={styles.spinner} />
                </div>
            ) : (
                <div className={styles.image}>
                    <img
                        src="/api/placeholder/400/300"
                        alt="Placeholder"
                        className="rounded-lg shadow-lg"
                        width="400"
                        height="300"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageLoader;