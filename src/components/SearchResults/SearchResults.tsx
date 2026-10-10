import React, { FormEvent } from 'react';
import { getMovieById } from '../../utils/apiUtils';
import { formatDate } from '../../utils/helpers';
import { useSearchContext } from '../../contexts/SearchContext';
import { Modal } from '../Modal';
import { MovieDetails } from '../MovieDetails';
import { GaugeSVG } from '../GaugeSVG';
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

export function SearchResults() {
  const { searchResults, error, selectedMovieId, updateSelectedMovieId, updateMovieData } =
    useSearchContext();

  const { URL_IMAGE_POSTER_w342, URL_IMAGE_POSTER_w500 } = imageConfig;

  const openModal = async (movieId: number, event: FormEvent<Element>) => {
    event.preventDefault();
    try {
      const data = await getMovieById(movieId);
      updateSelectedMovieId(movieId);
      updateMovieData(data);
    } catch (err) {
      console.error('Error fetching movie details in openModal():', err);
    }
  };

  const closeModal = () => {
    updateSelectedMovieId(0);
    updateMovieData(null);
  };

  if (error) {
    return (
      <section>
        <div className='alert alert-danger mt-3' role='alert'>
          <i className='fas fa-exclamation-triangle me-2'></i>
          Could not load movies: {error}
        </div>
      </section>
    );
  }

  return (
    <section>
      {selectedMovieId > 0 && (
        <Modal isOpening={true} isOpen={!!selectedMovieId} closeModal={closeModal}>
          <MovieDetails />
        </Modal>
      )}
      <div className={`d-flex flex-wrap align-items-stretch ${styles['search-results']}`}>
        {searchResults.map((result) => (
          <div key={result.id} className={`card ${styles['res-item']}`}>
            <div
              className='bg-image hover-overlay ripple'
              data-mdb-ripple-color='light'>
              <div className='image'>
                <div className='wrapper'>
                  <a
                    className='image stretched-link'
                    href='#!openMovieDetails'
                    title={result.title}
                    onClick={(event: FormEvent<Element>) => openModal(result.id, event)}>
                    {!result.poster_path ? (
                      <div className='image-missing'></div>
                    ) : (
                      <img
                        className='poster'
                        src={`${URL_IMAGE_POSTER_w342}${result.poster_path}`}
                        srcSet={`${URL_IMAGE_POSTER_w342}${result.poster_path} 1x, ${URL_IMAGE_POSTER_w500}${result.poster_path} 2x`}
                        alt={result.title}
                        loading='lazy'
                      />
                    )}
                  </a>
                </div>
              </div>
              <div className={styles.mask}></div>
            </div>
            <div className={`card-body ${styles['card-body']}`}>
              <div className='d-flex flex-column justify-content-between h-100'>
                <h2 className='card-title res-item--title'>{result.title}</h2>
                <p className='card-text res-item--date'>
                  <span className='res-item--date-label'>Released:</span>
                  {formatDate(result.release_date)}
                </p>
              </div>

              <div className={`gauge ${styles['gauge']}`}>
                <GaugeSVG
                  id={result.id}
                  vote_average={result.vote_average}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
