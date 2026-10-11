# Movie Search - React App

Source code:
- [GitHub Repository](https://github.com/tommyullberg/movie-search)

Live demo:
- [GitHub Pages](https://tommyullberg.github.io/movie-search/)

## About

Movie Search is a modern web application built with React and TypeScript that connects to the [The Movie Database (TMDB) API](https://www.themoviedb.org/). The project was initially created in 2023 to practice React concepts and has since been continuously modernized with state-of-the-art tools, including React 19, Vite, Tailwind CSS v4, and shadcn/ui.

## Features

- Real-time movie search by title or keyword.
- Fast category exploration: Trending, Popular, Top Rated, and Upcoming releases.
- Pagination with infinite 'Load More' support and duplicate filtering.
- Rich movie detail dialogs with high-resolution backdrops, trailers/metadata, and IMDb links.
- Shimmering skeleton loaders during data fetching.
- Full dark and light mode theming, plus a dedicated WCAG AAA High Contrast mode.
- Complete keyboard accessibility with skip links and screen reader ARIA annotations.
- Response caching via browser CacheStorage for instant loading and minimal API quota usage.

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/tommyullberg/movie-search.git
cd movie-search
npm install
```

2. Configure your TMDB API credentials:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your TMDB API Read Access Token:

```env
VITE_TMDB_READ_ACCESS_TOKEN=your_token_here
```

3. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:5173/movie-search/](http://localhost:5173/movie-search/) in your browser.

4. Build for production:

```bash
npm run build
```

## Technologies

- React 19 / TypeScript
- Vite (Bundler & Dev Server)
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives)
- Lucide React Icons
- Context API (Search & Theme state management)
- React Router 7
- Framer Motion 14
- Native Fetch API with CacheStorage
- Marked 18 (Markdown parser)
- Husky & Commitlint (Conventional Commits)

## Planned next steps

- Explore additional TMDB data, such as trailers, video teasers, cast, and crew.
- Add filtering by release year and genres.
- Expand automated integration tests with Vitest.

--------------------------------

_Tommy Ullberg_
