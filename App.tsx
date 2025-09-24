
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import ListPage from './pages/ListPage';

const App: React.FC = () => {
    return (
        <div className="bg-dark-main min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/movie/:slug" element={<DetailPage />} />
                    <Route path="/watch/:slug/:episodeSlug" element={<WatchPage />} />
                    <Route path="/search/:keyword" element={<SearchPage />} />
                    <Route path="/list/:type/:slug" element={<ListPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
