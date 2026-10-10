import React, { FormEvent } from 'react';
import { getMovieById, fetchSearchResults } from '../../utils/apiUtils';
import { formatDate } from '../../utils/helpers';
import { useSearchContext } from '../../contexts/SearchContext';
import { Modal } from '../Modal';
import { MovieDetails } from '../MovieDetails';
import { GaugeSVG } from '../GaugeSVG';
import { imageConfig } from '../../config/imageConfig';
import { AnimatePresence, motion } from 'framer-motion';
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
  const { 
    searchResults, 
    isLoading,
    isFetchingMore,
    page,
    totalPages,
    searchTerm,
    searchCategory,
    appendSearchResults,
    updatePage,
    updateIsFetchingMore,
    error, 
    selectedMovieId, 
    updateSelectedMovieId, 
    updateMovieData 
  } = useSearchContext();

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

  const handleLoadMore = async () => {
    if (page < totalPages) {
      updateIsFetchingMore(true);
      const nextPage = page + 1;
      updatePage(nextPage);
      const { results } = await fetchSearchResults(searchTerm, searchCategory, nextPage);
      appendSearchResults(results as SearchResult[]);
      updateIsFetchingMore(false);
    }
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
      <AnimatePresence>
        {selectedMovieId > 0 && (
          <Modal movieId={selectedMovieId} isOpen={!!selectedMovieId} closeModal={closeModal}>
            <MovieDetails />
          </Modal>
        )}
      </AnimatePresence>
      <div className={`d-flex flex-wrap align-items-stretch ${styles['search-results']}`}>
        {searchResults.map((result) => (
          <motion.div 
            layoutId={`movie-card-${result.id}`}
            key={result.id} 
            className={`card ${styles['res-item']}`}
          >
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
          </motion.div>
        ))}

        {isLoading && Array.from({ length: 10 }).map((_, i) => (
          <div key={`skeleton-${i}`} className={`card ${styles['res-item']} ${styles['skeleton-card']}`}>
            <div className={styles['skeleton-image']}></div>
            <div className={`card-body ${styles['card-body']}`}>
              <div className={styles['skeleton-text']}></div>
              <div className={`${styles['skeleton-text']} ${styles['skeleton-text-short']}`}></div>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && searchResults.length === 0 && (searchTerm || searchCategory) && (
        <div className="text-center mt-5 mb-5">
          <i className="fas fa-film fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">No movies found</h3>
          <p className="text-muted">Try a different search term or category.</p>
        </div>
      )}

      {page < totalPages && searchResults.length > 0 && !isLoading && (
        <div className="text-center mt-4 mb-5">
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? (
              <><i className="fas fa-spinner fa-spin me-2"></i> Loading...</>
            ) : (
              'Load More Movies'
            )}
          </button>
        </div>
      )}
    </section>
  );
}
