import React, { useMemo } from 'react';
import AudioPlayer from './AudioPlayer';

const StoryDisplay = ({ story, onCreateNew }) => {

    const animatedText = useMemo(() => {
        if (!story.text) return null;
        
        let wordCount = 0;
        // Split by whitespace to handle words and newlines correctly
        return story.text.split(/(\s+)/).map((segment, index) => {
            if (segment.trim() === '') {
                // It's whitespace, preserve it without animation
                return <React.Fragment key={index}>{segment}</React.Fragment>;
            } else {
                // It's a word, animate it
                const delay = wordCount * 0.05; // Stagger delay based on word index
                wordCount++;
                return (
                    <span
                        key={index}
                        className="inline-block opacity-0 animate-fade-in-word"
                        style={{ animationDelay: `${delay}s` }}
                    >
                        {segment}
                    </span>
                );
            }
        });
    }, [story.text]);


    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold font-baloo text-brand-purple mb-4 text-center">Your Magical Story!</h2>
            
            {story.imageData && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-md">
                    <img 
                        src={`data:image/png;base64,${story.imageData}`} 
                        alt="A magical illustration for the story" 
                        className="w-full h-auto object-cover"
                    />
                </div>
            )}

            {story.audioData && (
                <div className="mb-6">
                    <AudioPlayer base64AudioData={story.audioData} />
                </div>
            )}
            <div className="prose prose-lg max-w-none text-gray-800 text-xl leading-relaxed whitespace-pre-wrap font-comic">
                {animatedText}
            </div>
            <div className="mt-8 text-center">
                <button
                    onClick={onCreateNew}
                    className="bg-brand-purple text-white font-bold text-lg py-3 px-6 rounded-lg hover:bg-violet-500 disabled:bg-gray-300 transition-colors smooth-interactive"
                >
                    Create Another Story
                </button>
            </div>
        </div>
    );
};

export default StoryDisplay;