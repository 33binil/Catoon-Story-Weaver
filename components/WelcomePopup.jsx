import React from 'react';

const CloseIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WelcomePopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative shadow-2xl animate-fade-in-scale">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
                    aria-label="Close welcome message"
                >
                    <CloseIcon className="h-8 w-8" />
                </button>
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-baloo text-brand-purple mb-4">
                        Welcome to Cartoon Story Weaver!
                    </h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Get ready to create your very own magical stories!
                    </p>
                    <p className="text-md text-gray-600 mb-6">
                        Just type in a story idea, or pick one of our suggestions, and watch as we bring it to life with a unique story, voice, and a beautiful illustration.
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-brand-purple text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-violet-500 transition-colors smooth-interactive"
                    >
                        Let's Go!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup;