import React from 'react';
import { useSearchContext } from '../../contexts/SearchContext';
import styles from './SearchResults.module.css';

export const DATA_URL: string = 'https://www.themoviedb.org';

const randomVals = Array.from({ length: 10 }, () => generateRandomValue());

function generateRandomValue() {
  return Math.floor(Math.random() * 100) + 1;
}

export function SearchResults() {
  const { searchCategory, searchTerm } = useSearchContext();

  if (!searchCategory || !searchTerm) {
    return (
      <div>
        <i>Make your search...</i>
      </div>
    );
  }
  //console.log(searchCategory, searchTerm);
  const items = randomVals.map((value, i) => (
    <div key={i} className={`card ${styles['res-item']}`}>
      <div
        className='bg-image hover-overlay ripple'
        data-mdb-ripple-color='light'>
        <div className='image'>
          <div className='wrapper'>
            <a className='image' href='/movie/697843' title='Extraction 2'>
              <img
                loading='lazy'
                className='poster'
                src={
                  DATA_URL +
                  '/t/p/w220_and_h330_face/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg'
                }
                srcSet={
                  DATA_URL +
                  '/t/p/w220_and_h330_face/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg 1x, ' +
                  DATA_URL +
                  '/t/p/w440_and_h660_face/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg 2x'
                }
                alt=''
              />
            </a>
          </div>
        </div>
        <a href='#!'>
          <div
            className='mask'
            style={{
              backgroundColor: 'rgba(251, 251, 251, 0.15)'
            }}></div>
        </a>
      </div>
      <div className={`card-body ${styles['card-body']}`}>
        <h5 className='card-title res-item--title'>Extraction 2</h5>
        <p className='card-text res-item--date'>09 Jun 2023</p>

        <div className={`gauge ${styles['gauge']}`}>
          <object
            id={`gauge${i}`}
            data-value={value}
            className='gauges'
            data='/images/gauge.svg'
            type='image/svg+xml'>
            Gauge
          </object>
        </div>
      </div>
    </div>
  ));

  return (
    <section>
      <div>
        searchCategory: {searchCategory}
        <br />
        searchTerm: {searchTerm}
      </div>
      <div className={`d-flex flex-wrap ${styles['search-results']}`}>
        {items}
      </div>
    </section>
  );
}
