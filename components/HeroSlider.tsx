import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { IMovieItem } from '../types';
import { IMG_DOMAIN } from '../services/api';

interface HeroSliderProps {
    movies: IMovieItem[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        if (movies.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [movies.length]);

    if (movies.length === 0) return null;

    const currentMovie = movies[currentIndex];

    return (
        <div className="relative w-full h-[50vh] md:h-[80vh] text-white">
            {movies.map((movie, index) => {
                const imageUrl = movie.thumb_url.startsWith('http')
                    ? movie.thumb_url
                    : `${IMG_DOMAIN}/${movie.thumb_url}`;
                return (
                    <div
                        key={movie._id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={imageUrl} alt={movie.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-main via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-dark-main to-transparent opacity-70"></div>
                    </div>
                );
            })}
            
            <div className="relative z-10 flex flex-col justify-end h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 line-clamp-2">{currentMovie.name}</h1>
                <p className="text-lg mb-6">{currentMovie.origin_name} ({currentMovie.year})</p>
                <div className="flex space-x-4">
                    <Link to={`/movie/${currentMovie.slug}`} className="bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded-md flex items-center transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Xem chi tiết
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {movies.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-primary' : 'bg-gray-500'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;