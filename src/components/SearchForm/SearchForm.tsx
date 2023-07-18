import React from 'react';
import { useSearchContext } from '../../contexts/SearchContext';
import { fetchSearchResults } from '../../utils/apiUtils';
import styles from './SearchForm.module.css';

export function SearchForm() {
  const {
    searchCategory,
    searchTerm,
    updateSearchCategory,
    updateSearchTerm,
    updateSearchResults
  } = useSearchContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateSearchTerm(value);
    updateSearchCategory('');
  };

  const handleCategoryClick = (category: string) => {
    updateSearchCategory(category);
    updateSearchTerm('');
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const results = await fetchSearchResults(searchTerm, searchCategory);
    updateSearchResults(results);
  };

  return (
    <section className={styles.SearchForm}>
      <div className='card mb-3'>
        <div className='card-header py-3'>
          <h1 className='mb-0 text-center'>
            <strong>Search</strong>
          </h1>{/*
          searchTerm: {searchTerm}<br />
          searchCategory: {searchCategory} */}
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
                className={`btn ${
                  searchTerm.length ? 'btn-success' : 'btn-primary'
                } ripple ripple-surface`}>
                <i className='fas fa-search'></i>
              </button>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mx-auto'>
              <button
                className={`ripple ripple-surface btn ${
                  searchCategory === 'trending' ? 'btn-success' : 'btn-primary'
                } mx-0 px-0`}
                onClick={() => handleCategoryClick('trending')}>
                Trending
              </button>
              <button
                className={`ripple ripple-surface btn ${
                  searchCategory === 'popular' ? 'btn-success' : 'btn-primary'
                } mx-0 px-0`}
                onClick={() => handleCategoryClick('popular')}>
                Popular
              </button>
              <button
                className={`ripple ripple-surface btn ${
                  searchCategory === 'toprated' ? 'btn-success' : 'btn-primary'
                } mx-0 px-0`}
                onClick={() => handleCategoryClick('toprated')}>
                Top rated
              </button>
              <button
                className={`ripple ripple-surface btn ${
                  searchCategory === 'upcoming' ? 'btn-success' : 'btn-primary'
                } mx-0 px-0`}
                onClick={() => handleCategoryClick('upcoming')}>
                Upcoming
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
