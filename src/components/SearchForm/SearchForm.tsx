import React from 'react';
import { useSearchContext } from '../../contexts/SearchContext';
import { fetchSearchResults } from '../../utils/apiUtils';
import { SearchResult } from '../SearchResults';
import styles from './SearchForm.module.css';

const CATEGORIES = [
  { key: 'trending', label: 'Trending' },
  { key: 'popular', label: 'Popular' },
  { key: 'toprated', label: 'Top rated' },
  { key: 'upcoming', label: 'Upcoming' }
] as const;

export function SearchForm() {
  const {
    searchCategory,
    searchTerm,
    isLoading,
    updateSearchCategory,
    updateSearchTerm,
    updateSearchResults,
    updateIsLoading,
    updateError
  } = useSearchContext();

  const runSearch = async (term: string, category: string) => {
    updateIsLoading(true);
    updateError(null);
    const { results, error } = await fetchSearchResults(term, category);
    updateSearchResults(results as SearchResult[]);
    if (error) updateError(error);
    updateIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchTerm(e.target.value);
    updateSearchCategory('');
  };

  const handleCategoryClick = async (category: string) => {
    updateSearchCategory(category);
    updateSearchTerm('');
    await runSearch('', category);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    await runSearch(searchTerm, searchCategory);
  };

  return (
    <section>
      <div className='card mb-3'>
        <div className='card-header py-3'>
          <h1 className='mb-0 text-center'>Find your favorite movies!</h1>
        </div>
        <div className='card-body'>
          <form className='max-w-lg mx-auto' onSubmit={handleSearch}>
            <div className='input-group mb-3'>
              <div className='form-outline'>
                <input
                  type='text'
                  className='form-control form-control-lg'
                  id='formControlLg'
                  autoComplete='off'
                  value={searchTerm}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <label className='form-label' htmlFor='formControlLg'>
                  Search for a movie...
                </label>
                <div className='form-notch'>
                  <div className='form-notch-leading'></div>
                  <div className='form-notch-middle'></div>
                  <div className='form-notch-trailing'></div>
                </div>
              </div>
              <button
                type='submit'
                aria-label='Search movies'
                disabled={isLoading}
                className={`btn ${searchTerm.length ? 'btn-success' : 'btn-primary'}`}>
                {isLoading
                  ? <i className='fas fa-spinner fa-spin'></i>
                  : <i className='fas fa-search'></i>}
              </button>
            </div>
            <div className={styles.buttons}>
              {CATEGORIES.map(({ key, label }) => (
                <button
                  key={key}
                  type='button'
                  disabled={isLoading}
                  className={`btn ${searchCategory === key ? 'btn-success' : 'btn-primary'} ${styles.btn}`}
                  onClick={() => handleCategoryClick(key)}>
                  {label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
