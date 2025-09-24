import React, { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategoryList, getCountryList } from '../services/api';
import type { IFilterListItem } from '../types';

const NavDropdown: React.FC<{ title: string; items: { name: string; slug: string; path: string }[] }> = ({ title, items }) => {
    return (
        <div className="group relative">
            <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {title}
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-screen max-w-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="bg-dark-secondary rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-4">
                        {items.map(item => (
                            <Link 
                                key={item.slug} 
                                to={item.path}
                                className="block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md text-sm"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const Navbar: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [categories, setCategories] = useState<IFilterListItem[]>([]);
    const [countries, setCountries] = useState<IFilterListItem[]>([]);
    const [years, setYears] = useState<{ name: string; slug: string; path: string }[]>([]);

    const movieTypes = [
        { name: 'Phim bộ', slug: 'phim-bo', path: '/list/type-list/phim-bo' },
        { name: 'Phim lẻ', slug: 'phim-le', path: '/list/type-list/phim-le' },
        { name: 'TV Shows', slug: 'tv-shows', path: '/list/type-list/tv-shows' },
        { name: 'Hoạt hình', slug: 'hoat-hinh', path: '/list/type-list/hoat-hinh' }
    ];

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, countryRes] = await Promise.all([
                    getCategoryList(),
                    getCountryList()
                ]);
                setCategories(catRes);
                setCountries(countryRes);
            } catch (error) {
                console.error("Failed to fetch navbar data:", error);
            }
        };

        const generateYears = () => {
            const currentYear = new Date().getFullYear();
            const yearList = [];
            for (let i = currentYear; i >= 2000; i--) {
                yearList.push({ name: `${i}`, slug: `${i}`, path: `/list/year/${i}` });
            }
            setYears(yearList);
        };

        fetchData();
        generateYears();
    }, []);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${encodeURIComponent(keyword.trim())}`);
            setKeyword('');
        }
    };

    return (
        <nav className="bg-dark-secondary sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-primary text-2xl font-bold flex-shrink-0">
                            MovieFlix
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                         <NavDropdown 
                            title="Thể loại" 
                            items={categories.map(c => ({...c, path: `/list/category/${c.slug}`}))} 
                        />
                        <NavDropdown 
                            title="Quốc gia" 
                            items={countries.map(c => ({...c, path: `/list/country/${c.slug}`}))} 
                        />
                         <NavDropdown 
                            title="Năm" 
                            items={years} 
                        />
                        <NavDropdown 
                            title="Loại phim" 
                            items={movieTypes} 
                        />
                    </div>
                    
                    <div className="flex items-center justify-end">
                        <div className="max-w-xs w-full">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    id="search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm transition-colors"
                                    placeholder="Tìm kiếm phim..."
                                    type="search"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;