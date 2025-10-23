import React, { useState, useEffect } from 'react';
import StoryPrompt from './components/StoryPrompt';
import StoryDisplay from './components/StoryDisplay';
import Loader from './components/Loader';
import WelcomePopup from './components/WelcomePopup';
import { generateStory, generateSpeech, generateImage } from './services/geminiService';

const App = () => {
    const [story, setStory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('prompt'); // 'prompt' or 'story'
    const [isFading, setIsFading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedStoryWeaver');
        if (!hasVisited) {
            setShowWelcome(true);
        }
    }, []);

    const handleCloseWelcome = () => {
        localStorage.setItem('hasVisitedStoryWeaver', 'true');
        setShowWelcome(false);
    };

    const switchView = (newView) => {
        setIsFading(true);
        setTimeout(() => {
            setView(newView);
            setIsFading(false);
        }, 400); // Duration of fade-out animation
    };

    const handleGenerateStory = async (prompt) => {
        setIsLoading(true);
        setError(null);
        setStory(null);

        try {
            const storyText = await generateStory(prompt);
            const [audioData, imageData] = await Promise.all([
                generateSpeech(storyText),
                generateImage(storyText)
            ]);
            setStory({ text: storyText, audioData, imageData });
            switchView('story');
        } catch (err) {
            let message = 'An unexpected error occurred.';
            if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCreateNew = () => {
        setStory(null);
        setError(null);
        switchView('prompt');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            {showWelcome && <WelcomePopup onClose={handleCloseWelcome} />}
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-brand-purple font-baloo tracking-wider opacity-0 animate-fade-in-up">
                    Cartoon Story Weaver
                </h1>
                <p className="text-brand-dark mt-2 text-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Turn your ideas into magical audio stories!
                </p>
            </header>
            <main className="container mx-auto px-4 max-w-3xl w-full flex flex-col items-center space-y-8">
                <div className={`w-full ${isFading ? 'animate-fade-out' : 'animate-fade-in'}`}>
                    {view === 'prompt' && (
                        <div className="w-full">
                           <StoryPrompt onGenerate={handleGenerateStory} isLoading={isLoading} />
                        </div>
                    )}

                    {view === 'story' && story && (
                        <StoryDisplay story={story} onCreateNew={handleCreateNew} />
                    )}
                </div>

                {isLoading && <Loader />}
                
                {view === 'prompt' && error && !isLoading && (
                    <div className="w-full bg-rose-100 border border-rose-300 text-rose-700 px-4 py-3 rounded-xl shadow-md animate-fade-in" role="alert">
                        <div>
                            <strong className="font-bold">Oh no! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;