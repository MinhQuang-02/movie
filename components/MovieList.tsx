import React, { useId } from 'react';
import { Link } from 'react-router-dom';
import type { IMovieItem } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
    movies: IMovieItem[];
    title: string;
    linkTo?: string;
    linkTitle?: string;
}

const MovieList: React.FC<MovieListProps> = ({ movies, title, linkTo, linkTitle }) => {
    const headingId = useId();
    const headingLinkTitle = linkTitle || `Xem ${title}`;
    const ctaTitle = linkTitle || `Xem tất cả ${title.toLowerCase()}`;

    return (
        <section className="py-8" aria-labelledby={headingId}>
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-6">
                <h2 id={headingId} className="text-2xl md:text-3xl font-bold text-white">
                    {linkTo ? (
                        <Link
                            to={linkTo}
                            title={headingLinkTitle}
                            className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            {title}
                        </Link>
                    ) : (
                        title
                    )}
                </h2>
                {linkTo && (
                    <Link
                        to={linkTo}
                        title={ctaTitle}
                        className="text-sm font-semibold text-primary hover:text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        Xem tất cả
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
                {movies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </section>
    );
};

export default MovieList;
