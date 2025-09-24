import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getNewMovies, getMoviesByListType } from '../services/api';
import type { IMovieListResponse, IMovieItem } from '../types';
import MovieList from '../components/MovieList';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import HeroSlider from '../components/HeroSlider';

const HomePage: React.FC = () => {
    const [data, setData] = useState<IMovieListResponse | null>(null);
    const [seriesMovies, setSeriesMovies] = useState<IMovieItem[]>([]);
    const [singleMovies, setSingleMovies] = useState<IMovieItem[]>([]);
    const [cartoons, setCartoons] = useState<IMovieItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const responseData = await getNewMovies(currentPage);
                setData(responseData);
                document.title = responseData.titlePage;

                if (currentPage === 1) {
                    const [seriesRes, singleRes, cartoonRes] = await Promise.all([
                        getMoviesByListType('phim-bo', 1),
                        getMoviesByListType('phim-le', 1),
                        getMoviesByListType('hoat-hinh', 1),
                    ]);
                    setSeriesMovies(seriesRes.data.items.slice(0, 6));
                    setSingleMovies(singleRes.data.items.slice(0, 6));
                    setCartoons(cartoonRes.data.items.slice(0, 6));
                }

            } catch (err) {
                setError('Failed to fetch movies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    if (loading && !data) return <Spinner />;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (!data) return null;

    return (
        <div>
            {currentPage === 1 && <HeroSlider movies={data.items.slice(0, 6)} />}
            <div className="max-w-7xl mx-auto">
                <MovieList 
                    movies={currentPage === 1 ? data.items.slice(6, 12) : data.items} 
                    title="Phim Mới Cập Nhật" 
                />

                {currentPage === 1 && (
                    <>
                        {seriesMovies.length > 0 && <MovieList movies={seriesMovies} title="Phim Bộ Nổi Bật" />}
                        {singleMovies.length > 0 && <MovieList movies={singleMovies} title="Phim Lẻ Đề Cử" />}
                        {cartoons.length > 0 && <MovieList movies={cartoons} title="Hoạt Hình Hay" />}
                    </>
                )}

                {data.params?.pagination && data.params.pagination.totalPages > 1 && (
                    <Pagination 
                        currentPage={data.params.pagination.currentPage} 
                        totalPages={data.params.pagination.totalPages} 
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default HomePage;