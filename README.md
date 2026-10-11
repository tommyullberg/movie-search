# Movie Search - React App

Source code:
- [GitHub Repository](https://github.com/tommyullberg/movie-search)

Live demo:
- [GitHub Pages](https://tommyullberg.github.io/movie-search/)

## About

Movie Search is a modern web application built with React and TypeScript that connects to the [The Movie Database (TMDB) API](https://www.themoviedb.org/). The project was initially created in 2023 to practice React concepts and has since been continuously modernized with state-of-the-art tools, including React 19, Vite, Tailwind CSS v4, and shadcn/ui.

## Features

### Movie & Discovery Features

- Real-time movie search by title, keyword, or director.
- Integrated search type selector dropdown within the search bar: toggle between Movies, Cast & Crew (actors and directors), and Keywords/Themes.
- Persistent Advanced Discover & Filters panel (remembers open/collapsed state in localStorage): filter by official TMDB genres, release year, minimum user rating, and sort order (popularity, rating, newest, box office).
- Instant category exploration: In Theaters, Trending, Popular, Top Rated, and Upcoming with subtle visual grouping separator.
- Personal Watchlist and Watched movie tracking with localStorage persistence, one-click quick actions directly from cards and detail modal, dedicated library row, and custom empty states.
- Dedicated Library Toolbar for personal lists with live tab switching between 'To Watch' and 'Watched'.
- Multi-criteria library sorting: sort saved and watched movies by date added, user rating, release year, or title.
- JSON Backup and Restore: export your entire movie library (Watchlist & Watched) to a JSON file and import/merge libraries anytime with built-in validation.
- Shimmering skeleton loaders during data fetching for smooth perceived performance.
- Interactive movie cards with posters, title, release date, and circular user rating gauges.
- Pagination with infinite 'Load More' button and automatic duplicate result filtering.
- Rich movie detail dialogs featuring high-resolution backdrop art and official posters.
- Embedded official YouTube trailers with responsive widescreen player and toggle control.
- Key movie facts including production status, budget, box office revenue, and studio names.
- Where to Watch streaming guide powered by JustWatch with official logos for subscription streaming, digital rental, and purchase in Sweden (with US fallback).
- Top cast section showcasing actor profile photos, real names, and character roles, plus director credits.
- Dedicated Person / Actor & Director profile views featuring high-resolution portrait photos, full biography, birthday with calculated age, birthplace, external IMDb links, and comprehensive chronological filmographies.
- Bidirectional in-modal navigation between movies, actors, directors, and recommendations with a contextual Back button ('Back to [Previous]') that tracks modal browsing history and only displays after internal navigation.
- URL deep linking (?movie=123, ?person=456) with native browser back/forward history support and one-click 'Share' buttons that copy direct links to the clipboard with instant visual confirmation.
- 'More Like This' movie recommendations with seamless in-modal navigation between related titles.
- Direct external links to official movie websites and IMDb pages.

### Design, Theming & Accessibility Features

- Modern UI built with Tailwind CSS v4 and shadcn/ui (Radix UI primitives).
- Light mode and Dark mode with smooth transitions and deep, crisp contrast.
- Dedicated WCAG AAA High Contrast mode with specialized contrast themes for both dark and light palettes.
- Complete keyboard accessibility: fully operable without mouse, with prominent focus rings and skip-to-content link.
- Screen reader optimizations: semantic landmark roles, descriptive ARIA labels, and live region announcements.
- Adaptive responsive layout: edge-to-edge fullscreen dialog on mobile screens (<640px) down to 320px width, expanding to a floating centered window on larger displays.
- Sleek custom internal scrollbars that preserve dialog rounded corner aesthetics.
- Native browser CacheStorage for instant response caching and minimal network latency.

## Technologies

- React 19 / TypeScript
- Vite (Bundler & Dev Server)
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives)
- Lucide React Icons
- Context API (Search, Theme & Watchlist state management)
- React Router 7
- Framer Motion 14
- Native Fetch API with CacheStorage
- Marked 18 (Markdown parser)
- Husky & Commitlint (Conventional Commits)

## Planned next steps

- Expand automated integration tests with Vitest.
- Enhanced filtering by streaming provider.

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

--------------------------------

_Tommy Ullberg_
