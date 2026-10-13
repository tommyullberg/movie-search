var e=`# Movie Search - React App

![Movie Search v2 Showcase](docs/images/v2-showcase.png)

> **Visual Showcase**: Additional full-resolution screenshots and an interactive video recording can be found in the [Screenshots & Media](#screenshots--media) section at the bottom of this page.

Source code:
- [GitHub Repository](https://github.com/tommyullberg/movie-search)

Live demo:
- [GitHub Pages (v2.x main)](https://tommyullberg.github.io/movie-search/)
- [GitHub Pages (v1.0.0 legacy)](https://tommyullberg.github.io/movie-search/v1/)

## About

Movie Search is a modern web application built with React and TypeScript that connects to the [The Movie Database (TMDB) API](https://www.themoviedb.org/). The project was initially created in 2023 to practice React concepts and has since been continuously modernized with state-of-the-art tools, including React 19, Vite, Tailwind CSS v4, and shadcn/ui.

## Features

### Movie & Discovery Features

- Real-time movie search by title, keyword, or director.
- Integrated search type selector dropdown within the search bar: toggle between Movies, Cast & Crew (actors and directors), and Keywords/Themes.
- Persistent Advanced Discover & Filters panel (remembers open/collapsed state in localStorage): filter by official TMDB genres, release year, minimum user rating, sort order (popularity, rating, newest, box office), and Swedish streaming service.
- Dedicated Swedish streaming provider filtering: filter directly by major platforms in Sweden (Netflix, Max, Disney+, Prime Video, SkyShowtime, Viaplay, Apple TV+, TV4 Play, SVT Play).
- Instant category exploration: In Theaters, Trending, Popular, Top Rated, and Upcoming with subtle visual grouping separator.
- Personal Watchlist and Watched movie tracking with localStorage persistence, one-click quick actions directly from cards and detail modal, dedicated library row, and custom empty states.
- Personal movie ratings (1 to 10 scale) and custom reviews/notes for watched movies, preserved in localStorage and displayed with badges in Watched view.
- Animated Surprise Movie Picker ('Surprise Me' / 'Random movie from top 50'): pulls top 50 movies from your chosen category (Watchlist, Trending, Popular, Top Rated, In Theaters, Upcoming, or Genre), loads them into a 3D horizontal card reel with Mac Dock magnification and deceleration physics, crowning a winner with celebratory glow, re-roll action, direct 'Go to movie' access, and grid highlighting.
- Dedicated Watchlist Toolbar for personal lists with live tab switching between 'To Watch' and 'Watched'.
- Multi-criteria library sorting: sort saved and watched movies by date added, personal rating (1-10), TMDB user rating, release year, or title.
- JSON Backup and Restore: export your entire movie library (Watchlist, Watched, and personal ratings/notes) to a JSON file and import/merge libraries anytime with built-in validation.
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
- Light mode and Dark mode with smooth transitions, customized neutral background (#e8eaec), and deep, crisp contrast.
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

- Expand automated integration and component tests with Vitest.
- Set up a GitHub Actions CI/CD pipeline to automatically run typechecks, tests, build, and deploy tagged release versions to GitHub Pages (and optionally mirror production builds to custom web hosting via secure FTP/SFTP).

## Getting Started

1. Clone the repository and install dependencies:

\`\`\`bash
git clone https://github.com/tommyullberg/movie-search.git
cd movie-search
npm install
\`\`\`

2. Configure your TMDB API credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Open \`.env.local\` and add your TMDB API Read Access Token:

\`\`\`env
VITE_TMDB_READ_ACCESS_TOKEN=your_token_here
\`\`\`

3. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:5173/movie-search/](http://localhost:5173/movie-search/) in your browser.

4. Build for production:

\`\`\`bash
npm run build
\`\`\`

## <a id="screenshots--media"></a>Screenshots & Media

<details>
<summary><strong>Click to expand all screenshots and video walkthrough</strong></summary>

### 1. Version 2.0 (Modern)

<br />

#### 🎬 **Home & Discovery Grid**

Main search view featuring dark theme, category selector, rating gauges, and modern movie cards.

![v2 Preview](docs/images/v2-preview.png)

<br />

#### 🔍 **Advanced Filters & Swedish Streaming**

Discover movies by Swedish streaming services, genre, year, minimum rating, and sort order.

![v2 Filters](docs/images/v2-filters.png)

<br />

#### 🎲 **3D Surprise Movie Reel**

Interactive 3D spinning card reel with deceleration physics, reticle highlighting, and spotlight winner.

![v2 Surprise Reel](docs/images/v2-surprise.png)

<br />

#### 📋 **Movie Details View**

Comprehensive detail modal featuring backdrop, trailer toggle, budget overview, rating and notes, where to watch streaming options, and quick actions.

![v2 Details](docs/images/v2-details.png)

<br />

#### 🎥 **Surprise Movie Reel Video Walkthrough**

Live screen recording showing the 3D card reel in action, rolling and decelerating to a winner.

https://github.com/user-attachments/assets/d7bdd08d-93c0-466f-b555-479ba84308cf

<br />

#### 📜 **Full Movie Details Dialog**

Entire scroll height of the movie details view, including key financial facts, user rating notes, streaming providers, top cast with avatars, and movie recommendations.

![v2 Details Full](docs/images/v2-details-full.png)

<br />
<br />

### 2. Version 1.0 (Legacy)

<br />

#### 🏛️ **Home Page (v1.0.0)**

The original 2023 movie search interface with classic categories and poster grid.

![v1 Preview](docs/images/v1-preview.png)

<br />

#### 📑 **Movie Details (v1.0.0)**

The legacy movie details modal layout.

![v1 Details](docs/images/v1-details.png)

<br />

</details>

--------------------------------

_Tommy Ullberg_
`;export{e as default};