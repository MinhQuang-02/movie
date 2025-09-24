import React from 'react';

export const SkeletonCard: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-700 rounded-lg aspect-[2/3]"></div>
            <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
    );
};

export const MovieListSkeleton: React.FC<{ count: number; title?: boolean }> = ({ count, title = true }) => {
    return (
        <div className="py-8">
            {title && <div className="h-8 bg-gray-700 rounded w-1/4 mb-6 animate-pulse px-4 sm:px-6 lg:px-8"></div>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
                {Array.from({ length: count }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        </div>
    );
};

export const HeroSliderSkeleton: React.FC = () => {
    return (
        <div className="relative w-full h-[50vh] md:h-[80vh] bg-dark-secondary animate-pulse">
            <div className="relative z-10 flex flex-col justify-end h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
                <div className="h-12 bg-gray-700 rounded w-3/5 mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
                <div className="h-12 bg-gray-700 rounded w-40"></div>
            </div>
        </div>
    );
};

export const DetailPageSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse">
            <div className="relative h-[40vh] md:h-[60vh] bg-gray-700"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 -mt-20 md:-mt-40 relative z-10">
                <div className="md:flex md:space-x-8">
                    <div className="md:w-1/3 flex-shrink-0">
                        <div className="bg-gray-700 rounded-lg w-full aspect-[2/3]"></div>
                    </div>
                    <div className="md:w-2/3 mt-6 md:mt-0">
                        <div className="h-10 bg-gray-700 rounded w-4/5"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/2 mt-3"></div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                            <div className="h-8 w-24 bg-gray-700 rounded-full"></div>
                            <div className="h-8 w-20 bg-gray-700 rounded-full"></div>
                            <div className="h-8 w-28 bg-gray-700 rounded-full"></div>
                        </div>
                        
                        <div className="mt-6 space-y-3">
                            <div className="h-4 bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-700 rounded w-11/12"></div>
                            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-700 rounded w-10/12"></div>
                        </div>

                        <div className="mt-6">
                            <div className="h-6 bg-gray-700 rounded w-1/4 mb-3"></div>
                            <div className="flex flex-wrap gap-2">
                                <div className="h-8 w-24 bg-gray-700 rounded-full"></div>
                                <div className="h-8 w-32 bg-gray-700 rounded-full"></div>
                                <div className="h-8 w-20 bg-gray-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                        {Array.from({ length: 20 }).map((_, index) => (
                            <div key={index} className="h-10 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
