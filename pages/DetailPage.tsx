import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import type { IMovieDetailResponse } from '../types';
import { IMG_DOMAIN } from '../services/api';
import { DetailPageSkeleton } from '../components/Skeletons';

const DetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<IMovieDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!slug) return;
            setLoading(true);
            setError(null);
            try {
                const responseData = await getMovieDetails(slug);
                setData(responseData);
                document.title = responseData.movie.name;
            } catch (err) {
                setError('Failed to fetch movie details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return <DetailPageSkeleton />;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (!data) return null;

    const { movie, episodes } = data;
    const posterUrl = movie.poster_url.startsWith('http') ? movie.poster_url : `${IMG_DOMAIN}/${movie.poster_url}`;
    const thumbUrl = movie.thumb_url.startsWith('http') ? movie.thumb_url : `${IMG_DOMAIN}/${movie.thumb_url}`;

    return (
        <div className="text-white">
            <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
                <img src={thumbUrl} alt={movie.name} className="w-full h-full object-cover object-top ken-burns" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-main via-dark-main/70 to-transparent"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-20 md:-mt-40 relative z-10">
                <div className="md:flex md:space-x-8">
                    <div className="md:w-1/3 flex-shrink-0">
                        <img src={posterUrl} alt={movie.name} className="rounded-lg shadow-lg w-full" />
                    </div>
                    <div className="md:w-2/3 mt-6 md:mt-0">
                        <h1 className="text-3xl md:text-5xl font-bold">{movie.name}</h1>
                        <h2 className="text-xl text-gray-400 mt-1">{movie.origin_name} ({movie.year})</h2>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-dark-secondary px-3 py-1 rounded-full text-sm">{movie.quality}</span>
                            <span className="bg-dark-secondary px-3 py-1 rounded-full text-sm">{movie.lang}</span>
                            <span className="bg-dark-secondary px-3 py-1 rounded-full text-sm">{movie.episode_current}</span>
                        </div>
                        
                        <div className="mt-6 prose prose-invert max-w-none prose-p:text-gray-300" dangerouslySetInnerHTML={{ __html: movie.content }} />

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Thể loại</h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.category.map(cat => (
                                    <Link key={cat.slug} to={`/list/category/${cat.slug}`} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition-colors">{cat.name}</Link>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Quốc gia</h3>
                             <div className="flex flex-wrap gap-2">
                                {movie.country.map(c => (
                                    <Link key={c.slug} to={`/list/country/${c.slug}`} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition-colors">{c.name}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-4">Danh sách tập</h3>
                    {episodes.length > 0 ? episodes.map(server => (
                        <div key={server.server_name} className="mb-6">
                            <h4 className="text-xl font-semibold text-primary mb-3">{server.server_name}</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                                {server.server_data.map(ep => (
                                    <Link 
                                        key={ep.slug} 
                                        to={`/watch/${movie.slug}/${ep.slug}`}
                                        className="bg-dark-secondary hover:bg-primary text-center py-2 px-1 rounded transition-colors"
                                    >
                                        {ep.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-400">Chưa có tập nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailPage;