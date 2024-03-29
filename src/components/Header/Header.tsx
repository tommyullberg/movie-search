import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faHouse } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';

export function Header() {
  const publicPath = process.env.PUBLIC_URL;
  return (
    <header className={styles.Header}>
      <nav
        id='navbar'
        className={`${styles.navbar} navbar navbar-expand-lg navbar-dark bg-dark fixed-top mx-auto`}>
        <div className='container-fluid justify-content-center'>
          <div id='headerLeft' className='navbar-nav flex-row d-none d-sm-flex invisible'>
            <div className='nav-link mx-1'>
              <FontAwesomeIcon className={styles.icon} icon={faHouse} />
            </div>
            <div className='nav-link mx-1'>
              <FontAwesomeIcon
                className={styles.icon}
                icon={faCircleQuestion}
              />
            </div>
          </div>
          <NavLink
            className='navbar-brand flex-grow-1'
            to={`${publicPath}/`}
            end>
            <span className={`top-logo ${styles['top-logo']}`}>
              TMDB - The Movie DB
            </span>
          </NavLink>
          <div id='headerRight' className='navbar-nav flex-row'>
            <NavLink
              className='nav-link mx-1'
              to={`${publicPath}/`}
              state={{ direction: 'left' }}
              end>
              <FontAwesomeIcon className={styles.icon} icon={faHouse} />
              <span className='sr-only'>Home</span>
            </NavLink>
            <NavLink
              className='nav-link mx-1'
              to={`${publicPath}/about`}
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
