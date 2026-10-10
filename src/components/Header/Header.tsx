import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faHouse, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Header.module.css';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.Header}>
      <nav
        id='navbar'
        className={`${styles.navbar} navbar navbar-expand-lg ${theme === 'light' ? 'navbar-light bg-light' : 'navbar-dark bg-dark'} fixed-top mx-auto`}>
        <div className='container-fluid justify-content-center'>
          <div id='headerLeft' className='navbar-nav flex-row d-none d-sm-flex'>
            <button
              className='nav-link mx-1 btn btn-link'
              onClick={toggleTheme}
              aria-label='Toggle theme'
              title='Toggle Dark/Light Mode'>
              <FontAwesomeIcon
                className={styles.icon}
                icon={theme === 'dark' ? faSun : faMoon}
                fixedWidth
              />
            </button>
          </div>
          <NavLink
            className='navbar-brand flex-grow-1'
            to='/'
            end>
            <span className={`top-logo ${styles['top-logo']}`}>
              TMDB - The Movie DB
            </span>
          </NavLink>
          <div id='headerRight' className='navbar-nav flex-row'>
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
