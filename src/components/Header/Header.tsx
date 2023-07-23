import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faEnvelope, faHouse } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.Header}>
      <nav
        className={`${styles.navbar} navbar navbar-expand-lg navbar-dark bg-dark fixed-top mx-auto`}>
        <div className='container-fluid justify-content-center'>
          <NavLink className='navbar-brand ms-auto' to='/' end>
            <span className={`top-logo ${styles['top-logo']}`}>
              TMDB - The Movie DB
            </span>
          </NavLink>
          <div className='navbar-nav ms-auto flex-row'>
            <NavLink
              className='nav-link mx-1'
              to='/'
              state={{ direction: 'left' }}
              end>
              <FontAwesomeIcon className={styles.icon} icon={faHouse} />
              <span className='sr-only'>Home</span>
            </NavLink>
            <NavLink
              className='nav-link mx-1'
              to='/about'
              state={{ direction: 'right' }}
              end>
              <FontAwesomeIcon
                className={styles.icon}
                icon={faCircleQuestion}
              />
              <span className='sr-only'>About</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
