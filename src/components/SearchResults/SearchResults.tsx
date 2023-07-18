import React, { FormEvent, useEffect } from 'react';
import { getMovieById } from '../../utils/apiUtils';
import { formatDate } from '../../utils/helpers';
import { useSearchContext } from '../../contexts/SearchContext';
import { Modal } from '../Modal';
import { MovieDetails } from '../MovieDetails';
import { imageConfig } from '../../config/imageConfig';
import styles from './SearchResults.module.css';

export interface SearchResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

declare function addClassToSvgGauge(
  selector: string,
  voteAverage: string
): void;

export function SearchResults() {
  const { searchResults, selectedMovieId, updateSelectedMovieId, updateMovieData } = useSearchContext();

  const { URL_IMAGE_POSTER_w342, URL_IMAGE_POSTER_w500 } = imageConfig;

  useEffect(() => {
    const objectTags = document.querySelectorAll('object.gauges');
    objectTags.forEach((objectTag) => {
      objectTag.addEventListener('load', () => {
        const gaugeId = objectTag.id;
        const voteAverage = objectTag.getAttribute('data-value') || '';
        addClassToSvgGauge(gaugeId, voteAverage);
      });
    });
  }, [searchResults]);

  const openModal = async (movieId: number, event: FormEvent<Element>) => {
    event.preventDefault();
    console.log('movieId: ' + movieId);
    try {
      const data = await getMovieById(movieId);
      console.log('data: ' + data);
      updateSelectedMovieId(movieId);
      updateMovieData(data);
    } catch (error) {
      console.error('Error fetching movie details in openModal():', error);
    }
  };

  const closeModal = () => {
    updateSelectedMovieId(0);
    updateMovieData(null);
  };

  const renderResults = () => {
    return searchResults.map((result) => (
      <div key={result.id} className={`card ${styles['res-item']}`}>
        <div
          className='bg-image hover-overlay ripple'
          data-mdb-ripple-color='light'>
          <div className='image'>
            <div className='wrapper'>
              <a
                className='image'
                href='#!openMovieDetails'
                title={result.title}
                onClick={(event: FormEvent<Element>) =>
                  openModal(result.id, event)
                }>
                {!result.poster_path ? (
                  <div className='image-missing'></div>
                ) : (
                  <img
                    className='poster'
                    src={`${URL_IMAGE_POSTER_w342}${result.poster_path}`}
                    srcSet={`${URL_IMAGE_POSTER_w342}${result.poster_path} 1x, ${URL_IMAGE_POSTER_w500}${result.poster_path} 2x`}
                    alt=''
                  />
                )}
              </a>
            </div>
          </div>
          <a
            href='#!openMovieDetails'
            onClick={(event: FormEvent<Element>) =>
              openModal(result.id, event)
            }>
            <div className={styles.mask}></div>
          </a>
        </div>
        <div className={`card-body ${styles['card-body']}`}>
          <div className='d-flex flex-col justify-content-between h-100'>
            <h2 className='card-title res-item--title'>{result.title}</h2>
            <p className='card-text res-item--date'>
              <span className='res-item--date-label'>Released:</span>
              {formatDate(result.release_date)}
            </p>
          </div>

          <div className={`gauge ${styles['gauge']}`}>
            <object
              id={`gauge${result.id}`}
              data-value={result.vote_average}
              className='gauges'
              data='/images/gauge.svg'
              type='image/svg+xml'>
              Gauge
            </object>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section>
      {null != selectedMovieId && selectedMovieId > 0 && (
        <Modal isOpening={true} isOpen={!!selectedMovieId} closeModal={closeModal}>
          <MovieDetails />
        </Modal>
      )}
      <div
        className={`d-flex flex-wrap align-items-stretch ${styles['search-results']}`}>
        {renderResults()}
      </div>
    </section>
  );
}



