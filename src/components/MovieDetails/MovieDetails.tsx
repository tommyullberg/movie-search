import React from 'react';
import styles from './MovieDetails.module.css';
import { useSearchContext } from '../../contexts/SearchContext';
import { imageConfig } from '../../config/imageConfig';
import { formatDate, formatYear } from '../../utils/helpers';

const formatMinutesToTime = (minutes: number): string => {
  if (isNaN(minutes) || minutes <= 0) {
    return '';
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursStr = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
  const minutesStr =
    remainingMinutes > 0
      ? `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`
      : '';
  return `${hoursStr} ${minutesStr}`.trim();
};



export function MovieDetails() {
  const { movieData } = useSearchContext();
  const {
    URL_IMAGE_BACKDROP_w1280,
    URL_IMAGE_POSTER_w500,
    URL_IMAGE_POSTER_w780
  } = imageConfig;

  return (
    <div
      className={styles.modalContainer}
      style={{
        backgroundImage: `url(${URL_IMAGE_BACKDROP_w1280}${movieData?.backdrop_path})`
      }}>
      <div className={styles.backdropOverlay}></div>

      <div className={styles.modalContent}>
        <h1 className={styles.movieTitle}>
          {movieData?.title}{' '}
          <span>
            ({movieData?.release_date && formatYear(movieData?.release_date)})
          </span>
        </h1>

        <div className={styles.movieInfoTwoCol}>
          <div className={styles.posterContainer}>
            <img
              className={styles.posterImage}
              src={`${URL_IMAGE_POSTER_w500}${movieData?.poster_path}`}
              srcSet={`${URL_IMAGE_POSTER_w500}${movieData?.poster_path} 1x, ${URL_IMAGE_POSTER_w780}${movieData?.poster_path} 2x`}
              alt={movieData?.title}
            />
          </div>
          <div className={styles.movieInfo}>
            <p>{movieData?.overview}</p>
            <dl className={styles.movieInfoDl}>
              {movieData?.release_date && (
                <>
                  <dt>Release Date:</dt>
                  <dd>{formatDate(movieData.release_date)}</dd>
                </>
              )}
              {movieData?.runtime && (
                <>
                  <dt>Runtime:</dt>
                  <dd>{formatMinutesToTime(movieData.runtime)}</dd>
                </>
              )}
              {movieData?.spoken_languages && (
                <>
                  <dt>Spoken languages:</dt>
                  <dd>
                    {movieData.spoken_languages
                      .filter(
                        (language: { name: string }) => language.name.length > 0
                      )
                      .map((language: { name: string }) => language.name)
                      .join(', ')}
                  </dd>
                </>
              )}
              {movieData?.genres && (
                <>
                  <dt>Genres:</dt>
                  <dd>
                    {movieData.genres
                      .filter(
                        (genre: { name: string }) => genre.name.length > 0
                      )
                      .map((genre: { name: string }) => genre.name)
                      .join(', ')}
                  </dd>
                </>
              )}
              {movieData?.imdb_id && (
                <>
                  <dt>IMDB:</dt>
                  <dd>
                    <a
                      href={`https://www.imdb.com/title/${movieData.imdb_id}`}
                      target='_blank'
                      rel='noreferrer'>
                      https://www.imdb.com/title/{movieData.imdb_id}
                    </a>
                  </dd>
                </>
              )}
              {movieData?.homepage && (
                <>
                  <dt>Homepage:</dt>
                  <dd>
                    <a
                      href={movieData.homepage}
                      target='_blank'
                      rel='noreferrer'>
                      {movieData?.homepage}
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
