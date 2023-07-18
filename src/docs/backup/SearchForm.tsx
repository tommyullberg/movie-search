import React from 'react';
import {
  MDBBtn,
  MDBInput,
  MDBInputGroup
} from 'mdb-react-ui-kit';
import styles from './SearchForm.module.css';

export function SearchForm() {

  const value: string = "";

  return (
    <section className={styles.SearchForm}>
      <div className='card mb-3'>
        <div className='card-header py-3'>
          <h5 className='mb-0 text-center'>
            <strong>Search</strong>
          </h5>
        </div>
        <div className='card-body'>
          <form className='max-w-lg mx-auto'>
            <MDBInputGroup className='mb-3'>
              <MDBInput
                label='Search for a movie...'
                id='formControlLg'
                type='text'
                size='lg'
                value={value}
              />
              <MDBBtn color='primary'>
                <i className='fas fa-search'></i>
              </MDBBtn>
            </MDBInputGroup>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mx-auto'>
              <MDBBtn
                className='mx-0 px-0'
                color='primary'
                onClick={() => null}>
                Trending
              </MDBBtn>
              <MDBBtn
                className='mx-0 px-0'
                color='primary'
                onClick={() => null}>
                Popular
              </MDBBtn>
              <MDBBtn
                className='mx-0 px-0'
                color='primary'
                onClick={() => null}>
                Top rated
              </MDBBtn>
              <MDBBtn
                className='mx-0 px-0'
                color='primary'
                onClick={() => null}>
                Upcoming
              </MDBBtn>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
