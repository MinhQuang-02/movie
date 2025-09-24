import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/api';
import type { IMovieListResponse } from '../types';
import MovieList from '../components/MovieList';
import Pagination from '../components/Pagination';
import { MovieListSkeleton } from '../components/Skeletons';

const SearchPage: React.FC = () => {
    const { keyword } = useParams<{ keyword: string }>();
    const [data, setData] = useState<IMovieListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const fetchResults = async () => {
            if (!keyword) return;
            setLoading(true);
            setError(null);
            try {
                const response = await searchMovies(keyword, currentPage);
                setData(response.data);
                document.title = `Tìm kiếm: ${keyword}`;
            } catch (err) {
                setError('Không thể thực hiện tìm kiếm.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [keyword, currentPage]);

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    if (loading) return (
        <div className="pt-20">
            <div className="max-w-7xl mx-auto">
                <MovieListSkeleton count={18} />
            </div>
        </div>
    );
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (!data) return null;

    return (
        <div className="pt-20">
            <div className="max-w-7xl mx-auto">
                <MovieList 
                    movies={data.items} 
                    title={data.items.length > 0 ? `Kết quả tìm kiếm cho: "${keyword}"` : `Không tìm thấy kết quả cho: "${keyword}"`} 
                />
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

export default SearchPage;