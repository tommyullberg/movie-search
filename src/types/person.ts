export interface PersonCastCredit {
  id: number;
  title?: string;
  name?: string;
  character?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
}

export interface PersonCrewCredit {
  id: number;
  title?: string;
  name?: string;
  job?: string;
  department?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
}

export interface PersonMovieCredits {
  cast: PersonCastCredit[];
  crew: PersonCrewCredit[];
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  also_known_as: string[];
  imdb_id: string | null;
  popularity: number;
  movie_credits: PersonMovieCredits;
}

export interface PersonSearchResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  media_type?: 'person';
  known_for?: Array<{
    id: number;
    title?: string;
    name?: string;
    release_date?: string;
    poster_path?: string | null;
  }>;
}

export type PersonDetailsModel = PersonDetails;
