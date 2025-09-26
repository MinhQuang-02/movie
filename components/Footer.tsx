
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-secondary text-gray-400 py-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; {new Date().getFullYear()} MovieFlix. All Rights Reserved.</p>
                <p className="mt-2 text-sm">
                    Developer by QuangMinh
                </p>
            </div>
        </footer>
    );
};

export default Footer;
