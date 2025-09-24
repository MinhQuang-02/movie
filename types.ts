export interface IMovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
}

export interface IEpisode {
  server_name: string;
  server_data: {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }[];
}

export interface IMovieDetails extends IMovieItem {
  content: string;
  type: 'single' | 'series';
  status: string;
  category: { name: string; slug: string }[];
  country: { name:string; slug: string }[];
  chieurap: boolean;
  episode_current: string;
  quality: string;
  lang: string;
  episodes: IEpisode[];
}

export interface IPagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface IMovieListResponse {
  items: IMovieItem[];
  titlePage: string;
  params?: {
    pagination: IPagination;
  };
}

export interface IMovieDetailResponse {
  movie: IMovieDetails;
  episodes: IEpisode[];
}

export interface IFilterListItem {
  name: string;
  slug: string;
}