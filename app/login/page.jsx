'use client'
import React, { useState } from 'react';
import styles from '@/app/ui/login/login.module.css'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    // Hardcoded credentials
    const VALID_USERNAME = "admin";
    const VALID_PASSWORD = "password123";

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.username === VALID_USERNAME && formData.password === VALID_PASSWORD) {
            // Successful login
            router.push('/dashboard');
        } else {
            // Failed login
            setError('Invalid username or password');
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Image src='/ps_logo.png' alt='' width={300} height={100} className={styles.logo}/>
                {error && <div className={styles.error}>{error}</div>}
                <input
                    type='text'
                    placeholder='Username or Email'
                    id='username'
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    id='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <button type='submit' className={styles.login}>Login</button>
                <Link href='/login/forgot' className={styles.forgot}>forgot password</Link>
            </form>
        </div>
    );
};

export default LoginPage;