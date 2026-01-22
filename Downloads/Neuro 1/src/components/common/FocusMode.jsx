import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones } from 'lucide-react';

const TRACKS = [
    { name: 'Rainfall', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3' },
    { name: 'White Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-1256.mp3' },
    { name: 'Forest', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
];

const FocusMode = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(new Audio(TRACKS[0].url));

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
            audioRef.current.loop = true;
        }
        setIsPlaying(!isPlaying);
    };

    const changeTrack = (index) => {
        const wasPlaying = isPlaying;
        audioRef.current.pause();
        audioRef.current = new Audio(TRACKS[index].url);
        audioRef.current.loop = true;
        setCurrentTrack(index);
        if (wasPlaying) audioRef.current.play();
    };

    const toggleMute = () => {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full p-2 shadow-2xl flex items-center gap-2 transition hover:scale-105">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Headphones className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2 px-2">
                    <button
                        onClick={togglePlay}
                        className="p-2 hover:bg-slate-800 rounded-full text-white transition"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>

                    <div className="flex flex-col w-24">
                        <span className="text-xs font-bold text-white truncate">{TRACKS[currentTrack].name}</span>
                        <span className="text-[10px] text-slate-400">Focus Mode</span>
                    </div>

                    <button
                        onClick={() => changeTrack((currentTrack + 1) % TRACKS.length)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition"
                    >
                        Next
                    </button>

                    <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
