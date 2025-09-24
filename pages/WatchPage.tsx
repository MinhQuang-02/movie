
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import type { IMovieDetailResponse } from '../types';
import Spinner from '../components/Spinner';

const WatchPage: React.FC = () => {
    const { slug, episodeSlug } = useParams<{ slug: string; episodeSlug: string }>();
    const [data, setData] = useState<IMovieDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [embedUrl, setEmbedUrl] = useState<string>('');

    useEffect(() => {
        const fetchAndSetData = async () => {
            if (!slug || !episodeSlug) return;
            setLoading(true);
            setError(null);
            try {
                const response = await getMovieDetails(slug);
                setData(response);

                let foundUrl = '';
                for (const server of response.episodes) {
                    const episode = server.server_data.find(ep => ep.slug === episodeSlug);
                    if (episode) {
                        foundUrl = episode.link_embed;
                        break;
                    }
                }
                if (foundUrl) {
                    setEmbedUrl(foundUrl);
                    document.title = `Xem: ${response.movie.name} - Tập ${episodeSlug}`;
                } else {
                    setError('Tập phim không tồn tại.');
                }
            } catch (err) {
                setError('Không thể tải dữ liệu phim.');
            } finally {
                setLoading(false);
            }
        };
        fetchAndSetData();
    }, [slug, episodeSlug]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-black"><Spinner /></div>;
    if (error) return <div className="h-screen flex items-center justify-center bg-black text-red-500">{error}</div>;
    if (!data) return null;

    const { movie, episodes } = data;

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-black text-white">
            <div className="lg:w-3/4 w-full h-3/5 lg:h-full flex-shrink-0">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title={`${movie.name} - ${episodeSlug}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : <div className="w-full h-full flex items-center justify-center bg-black">Đang tải player...</div>}
            </div>

            <div className="lg:w-1/4 w-full h-2/5 lg:h-full flex flex-col p-4 bg-dark-secondary overflow-y-auto">
                 <Link to={`/movie/${movie.slug}`} className="mb-4">
                    <h2 className="text-xl font-bold hover:text-primary transition-colors">{movie.name}</h2>
                    <h3 className="text-gray-400">{movie.origin_name}</h3>
                </Link>
                <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-lg font-semibold mb-2">Danh sách tập</h4>
                    {episodes.map(server => (
                        <div key={server.server_name}>
                             <h5 className="text-md font-semibold text-primary mt-2 mb-1">{server.server_name}</h5>
                             <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
                                {server.server_data.map(ep => (
                                    <Link
                                        key={ep.slug}
                                        to={`/watch/${slug}/${ep.slug}`}
                                        className={`block text-center py-2 px-1 rounded transition-colors text-sm ${ep.slug === episodeSlug ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    >
                                        {ep.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
