import React, { useState, useEffect, useRef, useCallback } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';

const PlayIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const PauseIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

const AudioPlayer = ({ base64AudioData }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const audioBufferRef = useRef(null);
    const startTimeRef = useRef(0);
    const pausedAtRef = useRef(0);
    const animationFrameRef = useRef(0);

    const cleanup = useCallback(() => {
        if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setIsPlaying(false);
        setProgress(0);
        pausedAtRef.current = 0;
    }, []);

    useEffect(() => {
        const prepareAudio = async () => {
            if (!base64AudioData) return;
            cleanup();
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            }
            try {
                const audioBytes = decode(base64AudioData);
                if (!audioContextRef.current) return;
                const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
                audioBufferRef.current = buffer;
                setDuration(buffer.duration);
            } catch (error) {
                console.error('Failed to decode audio data:', error);
            }
        };

        prepareAudio();

        return () => {
            cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [base64AudioData]);

    const updateProgress = useCallback(() => {
        if (!isPlaying || !audioContextRef.current) return;
        const elapsedTime = audioContextRef.current.currentTime - startTimeRef.current + pausedAtRef.current;
        const newProgress = Math.min((elapsedTime / duration) * 100, 100);
        setProgress(newProgress);
        
        if (elapsedTime >= duration) {
            cleanup();
        } else {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    }, [isPlaying, duration, cleanup]);
    
    const play = useCallback(() => {
        if (!audioBufferRef.current || !audioContextRef.current) return;

        sourceRef.current = audioContextRef.current.createBufferSource();
        sourceRef.current.buffer = audioBufferRef.current;
        sourceRef.current.connect(audioContextRef.current.destination);

        startTimeRef.current = audioContextRef.current.currentTime;
        sourceRef.current.start(0, pausedAtRef.current);

        sourceRef.current.onended = () => {
            if (audioContextRef.current && audioContextRef.current.currentTime - startTimeRef.current >= duration) {
                cleanup();
            }
        };

        setIsPlaying(true);
        animationFrameRef.current = requestAnimationFrame(updateProgress);
    }, [duration, cleanup, updateProgress]);

    const pause = useCallback(() => {
        if (!sourceRef.current || !audioContextRef.current) return;
        
        pausedAtRef.current += audioContextRef.current.currentTime - startTimeRef.current;
        sourceRef.current.stop();
        sourceRef.current.disconnect();
        sourceRef.current = null;
        setIsPlaying(false);
        cancelAnimationFrame(animationFrameRef.current);
    }, []);

    const togglePlayPause = () => {
        if (!audioContextRef.current) return;

        if(audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    return (
        <div className="w-full flex items-center space-x-4 p-2 bg-gray-100 rounded-full shadow-inner">
            <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-brand-purple text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 transition-transform transform hover:scale-110"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
            </button>
            <div className="flex-grow">
                <div className="w-full bg-gray-300 rounded-full h-4">
                    <div className="bg-brand-purple h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="text-md text-gray-700 font-bold font-mono pr-4">
                {formatTime(duration * (progress / 100))} / {formatTime(duration)}
            </div>
        </div>
    );
};

export default AudioPlayer;