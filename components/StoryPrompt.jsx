import React, { useState, useEffect, useCallback } from 'react';
import { STORY_HEADINGS } from '../constants';

const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const StoryPrompt = ({ onGenerate, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const [shuffledHeadings, setShuffledHeadings] = useState([]);

    const handleShuffle = useCallback(() => {
        setShuffledHeadings(shuffleArray(STORY_HEADINGS).slice(0, 4));
    }, []);

    useEffect(() => {
        handleShuffle();
    }, [handleShuffle]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onGenerate(prompt);
        }
    };

    const handleHeadingClick = (heading) => {
        if (!isLoading) {
            setPrompt(heading);
            onGenerate(heading);
        }
    };

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What kind of story do you want?"
                    className="w-full flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent transition text-lg"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className={`w-full sm:w-auto text-white font-bold text-lg py-4 px-6 rounded-lg disabled:cursor-not-allowed transition-colors smooth-interactive ${
                        (isLoading || !prompt.trim()) ? 'bg-gray-300' : 'bg-brand-purple hover:bg-violet-500'
                    }`}
                >
                    Generate Story
                </button>
            </form>
            <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-600 font-bold">Or try one of these ideas:</p>
                    <button onClick={handleShuffle} disabled={isLoading} className="text-sm font-bold text-brand-purple hover:underline disabled:text-gray-400">
                        Shuffle
                    </button>
                </div>
                <div className="flex flex-wrap justify-start gap-3">
                    {shuffledHeadings.map((heading) => (
                        <button
                            key={heading}
                            onClick={() => handleHeadingClick(heading)}
                            disabled={isLoading}
                            className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-full hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors text-sm smooth-interactive"
                        >
                            {heading}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryPrompt;