
import React from 'react';
import type { IMovieItem } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
    movies: IMovieItem[];
    title: string;
}

const MovieList: React.FC<MovieListProps> = ({ movies, title }) => {
    return (
        <div className="py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white px-4 sm:px-6 lg:px-8">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
                {movies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MovieList;
