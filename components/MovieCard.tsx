
import React from 'react';
import { Link } from 'react-router-dom';
import type { IMovieItem } from '../types';
import { IMG_DOMAIN } from '../services/api';

interface MovieCardProps {
    movie: IMovieItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const imageUrl = movie.poster_url.startsWith('http') ? movie.poster_url : `${IMG_DOMAIN}/${movie.poster_url}`;

    return (
        <Link to={`/movie/${movie.slug}`} className="group block overflow-hidden rounded-lg shadow-lg relative bg-dark-secondary">
            <img 
                src={imageUrl} 
                alt={movie.name} 
                className="w-full h-auto object-cover aspect-[2/3] transform transition-transform duration-300 group-hover:scale-105" 
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-2 sm:p-4 text-white w-full">
                <h3 className="font-bold text-sm sm:text-base line-clamp-2">{movie.name}</h3>
                <p className="text-xs sm:text-sm text-gray-300">{movie.year}</p>
            </div>
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
