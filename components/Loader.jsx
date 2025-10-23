import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 my-10">
            <p className="text-2xl text-brand-dark font-bold font-baloo tracking-wide text-center">
                Weaving your story, audio, and a magical illustration
                <span className="animate-blink">.</span>
                <span className="animate-blink" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-blink" style={{ animationDelay: '0.4s' }}>.</span>
            </p>
        </div>
    );
};

export default Loader;