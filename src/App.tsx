import React from 'react';
import './App.css';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { SearchResults } from './components/SearchResults';
import { SearchContextProvider } from './contexts/SearchContext';

export default function App() {
  return (
    <SearchContextProvider>
      <Header />
      <main>
        <div className='container-fluid pt-4'>
          <SearchForm />
          <SearchResults />
        </div>
      </main>
    </SearchContextProvider>
  );
}


/*

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDkzNDM2MDY4MDFlN2M4ZTg4ZGI4MDIyZDU4ZDczNiIsInN1YiI6IjY0OGQ3MmZjNDJiZjAxMDBlNDllMmYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fK5V-siVy95A00Sm-Wl9GfbLIQHd2Bk32GLVqzEQkiU'
  }
};

fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

*/
