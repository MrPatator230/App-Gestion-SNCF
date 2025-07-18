import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './Infos.module.css';

export default function Infos() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stationMessage, setStationMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const gare = router.query.gare || ''; // get gare from URL query or default to empty string

  useEffect(() => {
    setIsMounted(true);
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    async function fetchStationMessage() {
      if (!router.isReady) return;
      if (!gare) return;
      try {
        const res = await fetch(`/api/stations?name=${encodeURIComponent(gare)}`);
        if (res.ok) {
          const data = await res.json();
          setStationMessage(data.message || '');
          console.log('Fetched station message:', data.message);
        } else {
          setStationMessage('');
        }
      } catch (error) {
        console.error('Failed to fetch station message:', error);
        setStationMessage('');
      }
    }
    fetchStationMessage();
  }, [gare, router.isReady]);

  return (
    <>
      <header className={styles.header}>
        <svg viewBox="0 0 500 500" className={styles.logo} aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" >
          <path d="M247 394.7c20.5 0 40.9-3.8 59.8-11.4l98.5 36.4c4.5 1.5 9.8 0 12.9-3.8s3-9.8 0-13.6l-45.5-65.2c60.6-69.7 52.3-175.8-17.4-235.6s-175.8-52.3-235.6 17.4-52.3 175.8 17.4 235.6c30.3 25.8 69.7 40.2 109.9 40.2zm-13.7-258.3c4.5-3 9.8-4.5 15.2-3.8 5.3 0 10.6 1.5 15.2 4.5 6.1 3 7.6 9.8 4.5 15.9-.8 2.3-3 3.8-4.5 4.5-4.5 3-9.8 4.5-15.2 4.5-5.3 0-10.6-1.5-15.2-4.5-3-2.3-6.1-6.1-6.1-10.6.1-4.5 2.3-8.3 6.1-10.5zM203 182.6c0-.8.8-1.5 1.5-1.5h60.6c.8 0 1.5.8 1.5 1.5v133.3c0 .8 0 2.3-1.5 2.3h-34.9c-.8 0-1.5-.8-1.5-1.5V204.5h-24.2c-.8 0-1.5-.8-1.5-1.5v-20.4zM500 485c0 8.3-5.9 15-13.1 15H13.1C5.9 500 0 493.3 0 485c0-8.2 5.9-15 13.1-15h473.8c7.2.1 13.1 6.8 13.1 15z" 
          fill="#ffffff"/>
        </svg>
        <h1 className={styles.title}>Informations</h1>
        <time className={styles.time} dateTime={isMounted ? currentTime.toISOString() : ''}>
          {isMounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </time>
      </header>
      {stationMessage && (
        <div className={styles.message} aria-live="polite" style={{ marginTop: '1rem', color: 'Black', fontWeight: 'bold' }}>
          {stationMessage}
        </div>
      )}
    </>
  );
}
