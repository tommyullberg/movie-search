import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { SearchResult } from './components/SearchResults';
import { fetchSearchResults } from './utils/apiUtils';
import App from './App';

jest.mock('./utils/apiUtils', () => ({
  fetchSearchResults: jest.fn()
}));

const fetchSearchResultsMock = fetchSearchResults as jest.MockedFunction<
  typeof fetchSearchResults
>;

const movieResult: SearchResult = {
  adult: false,
  backdrop_path: '',
  genre_ids: [],
  id: 123,
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'A movie used by the app tests.',
  popularity: 1,
  poster_path: '',
  release_date: '2025-01-01',
  title: 'Test Movie',
  video: false,
  vote_average: 7,
  vote_count: 1
};

beforeEach(() => {
  window.history.pushState({}, '', '/');
  fetchSearchResultsMock.mockResolvedValue([movieResult]);

  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: jest.fn().mockResolvedValue({
      text: () => Promise.resolve('# Test README content')
    })
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders the app heading and search controls', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: 'Find your favorite movies!' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('textbox', { name: 'Search for a movie...' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Search movies' })
  ).toBeInTheDocument();
});

test.each([
  ['Trending', 'trending'],
  ['Popular', 'popular'],
  ['Top rated', 'toprated'],
  ['Upcoming', 'upcoming']
])('loads results from the %s button', async (buttonName, category) => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: buttonName }));

  await waitFor(() => {
    expect(fetchSearchResultsMock).toHaveBeenCalledWith('', category);
  });
  expect(
    await screen.findByRole('heading', { name: 'Test Movie' })
  ).toBeInTheDocument();
});

test('submits a movie title search', async () => {
  render(<App />);

  fireEvent.change(
    screen.getByRole('textbox', { name: 'Search for a movie...' }),
    {
      target: { value: 'The Matrix' }
    }
  );
  fireEvent.click(screen.getByRole('button', { name: 'Search movies' }));

  await waitFor(() => {
    expect(fetchSearchResultsMock).toHaveBeenCalledWith('The Matrix', '');
  });
  expect(
    await screen.findByRole('heading', { name: 'Test Movie' })
  ).toBeInTheDocument();
});

test('navigates to the About page', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: 'About' }));

  expect(
    await screen.findByRole('heading', { name: 'About' })
  ).toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalled();
});
