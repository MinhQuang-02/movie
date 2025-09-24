import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getMoviesByFilter, getMoviesByListType } from '../services/api';
import type { IMovieListResponse } from '../types';
import MovieList from '../components/MovieList';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const ListPage: React.FC = () => {
    const { type, slug } = useParams<{ type: string; slug: string }>();
    const [data, setData] = useState<IMovieListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        const fetchFilteredMovies = async () => {
            if (!type || !slug) return;
            setLoading(true);
            setError(null);
            try {
                let responseData: IMovieListResponse;
                if (type === 'format' || type === 'type-list') {
                    const response = await getMoviesByListType(slug, currentPage);
                    responseData = response.data; 
                } else {
                    const response = await getMoviesByFilter(type, slug, currentPage);
                    responseData = response.data;
                }
                setData(responseData);
                document.title = responseData.titlePage;
            } catch (err) {
                setError('Không thể tải danh sách phim.');
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredMovies();
    }, [type, slug, currentPage]);

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    };

    if (loading) return <Spinner />;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (!data) return null;

    return (
        <div className="pt-20">
            <div className="max-w-7xl mx-auto">
                <MovieList 
                    movies={data.items} 
                    title={data.titlePage} 
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

export default ListPage;