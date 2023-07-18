import React from 'react';
import styles from './Header.module.css';


export function Header() {
  return (
    <header className={styles.Header}>
      <nav className={`${styles.navbar} navbar navbar-expand-lg navbar-dark bg-dark fixed-top mx-auto`}>
        <div className='container-fluid justify-content-center'>
          <a className='navbar-brand' href='#top'>
            <span className={styles['top-logo']}>TMDB - The Movie DB</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
