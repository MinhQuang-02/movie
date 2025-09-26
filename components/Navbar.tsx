import React, { useState, useEffect, FormEvent, ReactNode, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCategoryList, getCountryList, searchMovies, IMG_DOMAIN } from '../services/api';
import type { IFilterListItem, IMovieItem } from '../types';

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_DELAY = 300;
const MAX_SUGGESTIONS = 6;

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

const MobileAccordion: React.FC<{ title: string; children: ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 px-4 text-left text-lg font-semibold"
            >
                <span>{title}</span>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="pl-4 pb-2 bg-dark-secondary/50">
                    {children}
                </div>
            )}
        </div>
    );
};

const Navbar: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [categories, setCategories] = useState<IFilterListItem[]>([]);
    const [countries, setCountries] = useState<IFilterListItem[]>([]);
    const [years, setYears] = useState<{ name: string; slug: string; path: string }[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [searchResults, setSearchResults] = useState<IMovieItem[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const desktopSearchRef = useRef<HTMLDivElement | null>(null);
    const mobileSearchRef = useRef<HTMLDivElement | null>(null);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchAbortRef = useRef<AbortController | null>(null);

    const movieTypes = [
        { name: 'Phim bộ', slug: 'phim-bo', path: '/list/type-list/phim-bo' },
        { name: 'Phim lẻ', slug: 'phim-le', path: '/list/type-list/phim-le' },
        { name: 'TV Shows', slug: 'tv-shows', path: '/list/type-list/tv-shows' },
        { name: 'Hoạt hình', slug: 'hoat-hinh', path: '/list/type-list/hoat-hinh' }
    ];

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
        if (isMobileMenuOpen) {
            setShowSuggestions(false);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

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
                console.error('Failed to fetch navbar data:', error);
            }
        };

        const generateYears = () => {
            const currentYear = new Date().getFullYear();
            const yearList: { name: string; slug: string; path: string }[] = [];
            for (let i = currentYear; i >= 2000; i -= 1) {
                yearList.push({ name: `${i}`, slug: `${i}`, path: `/list/year/${i}` });
            }
            setYears(yearList);
        };

        fetchData();
        generateYears();
    }, []);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                desktopSearchRef.current?.contains(target) ||
                mobileSearchRef.current?.contains(target)
            ) {
                return;
            }
            setShowSuggestions(false);
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => document.removeEventListener('mousedown', handleDocumentClick);
    }, []);

    useEffect(() => {
        const term = keyword.trim();

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        if (searchAbortRef.current) {
            searchAbortRef.current.abort();
            searchAbortRef.current = null;
        }

        if (term.length < MIN_SEARCH_LENGTH) {
            setSearchResults([]);
            setSearchError(null);
            setSearchLoading(false);
            if (!term) {
                setShowSuggestions(false);
            }
            return;
        }

        setShowSuggestions(true);

        searchDebounceRef.current = setTimeout(async () => {
            const controller = new AbortController();
            searchAbortRef.current = controller;
            setSearchLoading(true);
            setSearchError(null);
            try {
                const response = await searchMovies(term, 1, controller.signal);
                const items = response.data.items.slice(0, MAX_SUGGESTIONS);
                setSearchResults(items);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    setSearchError('Không thể tải kết quả. Vui lòng thử lại.');
                    setSearchResults([]);
                }
            } finally {
                setSearchLoading(false);
                searchAbortRef.current = null;
            }
        }, DEBOUNCE_DELAY);

        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
            }
            if (searchAbortRef.current) {
                searchAbortRef.current.abort();
                searchAbortRef.current = null;
            }
        };
    }, [keyword]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const term = keyword.trim();
        if (term) {
            navigate(`/search/${encodeURIComponent(term)}`);
            setShowSuggestions(false);
            setKeyword('');
            setSearchResults([]);
            setIsMobileMenuOpen(false);
        }
    };

    const handleSuggestionSelect = () => {
        setShowSuggestions(false);
        setKeyword('');
        setSearchResults([]);
        setIsMobileMenuOpen(false);
    };

    const posterUrl = (movie: IMovieItem) => {
        if (!movie.poster_url) {
            return '';
        }
        return movie.poster_url.startsWith('http') ? movie.poster_url : `${IMG_DOMAIN}/${movie.poster_url}`;
    };

    const renderSuggestions = (variant: 'desktop' | 'mobile') => {
        if (!showSuggestions) return null;
        const term = keyword.trim();
        const wrapperClasses =
            variant === 'desktop'
                ? 'absolute right-0 top-full mt-2 w-[22rem] md:mr-2'
                : 'absolute left-0 right-0 top-full mt-2 w-full';

        return (
            <div className={`${wrapperClasses} z-50`}>
                <div className="bg-dark-secondary border border-gray-700/60 rounded-lg shadow-xl overflow-hidden">
                    {term.length < MIN_SEARCH_LENGTH ? (
                        <p className="px-4 py-3 text-sm text-gray-300">Nhập tối thiểu {MIN_SEARCH_LENGTH} ký tự để tìm kiếm.</p>
                    ) : searchLoading ? (
                        <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300">
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
                            Đang tìm kiếm...
                        </div>
                    ) : searchError ? (
                        <p className="px-4 py-3 text-sm text-red-400">{searchError}</p>
                    ) : searchResults.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-300">Không tìm thấy kết quả phù hợp.</p>
                    ) : (
                        <>
                            <ul className="divide-y divide-gray-700/60" role="listbox">
                                {searchResults.map(movie => (
                                    <li key={movie._id}>
                                        <Link
                                            to={`/movie/${movie.slug}`}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/70 transition-colors"
                                            onClick={handleSuggestionSelect}
                                        >
                                            <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded bg-gray-800">
                                                {posterUrl(movie) ? (
                                                    <img
                                                        src={posterUrl(movie)}
                                                        alt={movie.name}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">No image</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-white line-clamp-2">{movie.name}</p>
                                                <p className="text-xs text-gray-400 mt-1">{movie.origin_name} • {movie.year}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to={`/search/${encodeURIComponent(term)}`}
                                onClick={handleSuggestionSelect}
                                className="block text-center text-sm font-semibold text-primary hover:text-secondary transition-colors px-4 py-3 border-t border-gray-700/60"
                            >
                                Xem tất cả kết quả cho “{term}”
                            </Link>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <nav className="bg-dark-secondary sticky top-0 z-50 shadow-md text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-primary text-2xl font-bold">MovieFlix</Link>
                        <div className="hidden md:flex md:space-x-4">
                            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Trang chủ</Link>
                            <NavDropdown title="Thể loại" items={categories.map(cat => ({ name: cat.name, slug: cat.slug, path: `/list/category/${cat.slug}` }))} />
                            <NavDropdown title="Quốc gia" items={countries.map(c => ({ name: c.name, slug: c.slug, path: `/list/country/${c.slug}` }))} />
                            <NavDropdown title="Năm" items={years} />
                            <NavDropdown title="Loại phim" items={movieTypes} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-initial">
                        <div className="hidden md:block md:ml-4" ref={desktopSearchRef}>
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    className="block w-72 pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm transition-colors"
                                    placeholder="Tìm kiếm..."
                                    type="search"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onFocus={() => {
                                        if (keyword.trim().length >= MIN_SEARCH_LENGTH || searchResults.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    aria-label="Tìm kiếm phim"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </div>
                                {renderSuggestions('desktop')}
                            </form>
                        </div>

                        <div className="md:hidden flex-1 max-w-xs relative ml-3" ref={mobileSearchRef}>
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 text-sm"
                                    placeholder="Tìm kiếm..."
                                    type="search"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onFocus={() => {
                                        if (keyword.trim().length >= MIN_SEARCH_LENGTH || searchResults.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    aria-label="Tìm kiếm phim"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </div>
                            </form>
                            {renderSuggestions('mobile')}
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open menu">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 bg-dark-main z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700 h-16">
                    <Link to="/" className="text-primary text-2xl font-bold">MovieFlix</Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto">
                    <MobileAccordion title="Thể loại">
                        <div className="grid grid-cols-2 gap-2 p-2">
                            {categories.map(c => (
                                <Link key={c.slug} to={`/list/category/${c.slug}`} className="block p-2 rounded hover:bg-gray-700">
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </MobileAccordion>
                    <MobileAccordion title="Quốc gia">
                        <div className="grid grid-cols-2 gap-2 p-2">
                            {countries.map(c => (
                                <Link key={c.slug} to={`/list/country/${c.slug}`} className="block p-2 rounded hover:bg-gray-700">
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </MobileAccordion>
                    <MobileAccordion title="Năm">
                        <div className="grid grid-cols-3 gap-2 p-2">
                            {years.map(y => (
                                <Link key={y.slug} to={y.path} className="block p-2 rounded hover:bg-gray-700 text-center">
                                    {y.name}
                                </Link>
                            ))}
                        </div>
                    </MobileAccordion>
                    <MobileAccordion title="Loại phim">
                        <div className="grid grid-cols-2 gap-2 p-2">
                            {movieTypes.map(t => (
                                <Link key={t.slug} to={t.path} className="block p-2 rounded hover:bg-gray-700">
                                    {t.name}
                                </Link>
                            ))}
                        </div>
                    </MobileAccordion>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
