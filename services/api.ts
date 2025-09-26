import type { IMovieDetailResponse, IMovieListResponse, IFilterListItem } from '../types';

const API_BASE_URL = "https://phimapi.com";
export const IMG_DOMAIN = "https://img.phimapi.com";

interface IMovieListApiResponse {
  data: IMovieListResponse;
}

const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const getNewMovies = async (page = 1): Promise<IMovieListResponse> => {
  const limit = 18;
  const response = await fetch(`${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}&limit=${limit}`);
  return handleResponse<IMovieListResponse>(response);
};

export const getMovieDetails = async (slug: string): Promise<IMovieDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/phim/${slug}`);
  return handleResponse<IMovieDetailResponse>(response);
};

export const searchMovies = async (keyword: string, page = 1): Promise<IMovieListApiResponse> => {
  const response = await fetch(`${API_BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&page=${page}`);
  return handleResponse<IMovieListApiResponse>(response);
};

export const getMoviesByFilter = async (type: string, slug: string, page = 1): Promise<IMovieListApiResponse> => {
    const limit = 18;
    let url = '';
    switch(type) {
        case 'category':
            url = `${API_BASE_URL}/v1/api/the-loai/${slug}?page=${page}&limit=${limit}`;
            break;
        case 'country':
            url = `${API_BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}&limit=${limit}`;
            break;
        case 'year':
            url = `${API_BASE_URL}/v1/api/nam/${slug}?page=${page}&limit=${limit}`;
            break;
        default:
            throw new Error('Invalid filter type');
    }
    const response = await fetch(url);
    return handleResponse<IMovieListApiResponse>(response);
}

export const getMoviesByListType = async (typeSlug: string, page = 1): Promise<IMovieListApiResponse> => {
    const limit = 18;
    const response = await fetch(`${API_BASE_URL}/v1/api/danh-sach/${typeSlug}?page=${page}&limit=${limit}`);
    return handleResponse<IMovieListApiResponse>(response);
};

export const getCategoryList = async (): Promise<IFilterListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/the-loai`);
  return handleResponse<IFilterListItem[]>(response);
};

export const getCountryList = async (): Promise<IFilterListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/quoc-gia`);
  return handleResponse<IFilterListItem[]>(response);
};
