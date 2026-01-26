"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoundToggle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Initialize audio context (lazy - only when user clicks)
    const initAudio = () => {
        if (audioContextRef.current) return;

        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();

        // Create gain node for volume control
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = 0.03; // Very quiet
        gainNodeRef.current.connect(audioContextRef.current.destination);

        setIsLoaded(true);
    };

    // Create sci-fi ambient drone
    const createAmbientDrone = () => {
        if (!audioContextRef.current || !gainNodeRef.current) return;

        // Stop existing oscillators
        oscillatorsRef.current.forEach((osc) => {
            try {
                osc.stop();
            } catch {
                // Already stopped
            }
        });
        oscillatorsRef.current = [];

        const ctx = audioContextRef.current;
        const frequencies = [60, 90, 120, 180]; // Low ambient frequencies

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();

            osc.type = i % 2 === 0 ? "sine" : "triangle";
            osc.frequency.value = freq;

            // Subtle frequency modulation for organic feel
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 0.1 + Math.random() * 0.2;
            lfoGain.gain.value = freq * 0.02;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            oscGain.gain.value = 0.3 / frequencies.length;
            osc.connect(oscGain);
            oscGain.connect(gainNodeRef.current!);
            osc.start();

            oscillatorsRef.current.push(osc);
        });
    };

    const toggleSound = () => {
        if (!isLoaded) {
            initAudio();
        }

        if (!isPlaying) {
            if (audioContextRef.current?.state === "suspended") {
                audioContextRef.current.resume();
            }
            createAmbientDrone();
            setIsPlaying(true);
        } else {
            oscillatorsRef.current.forEach((osc) => {
                try {
                    osc.stop();
                } catch {
                    // Already stopped
                }
            });
            oscillatorsRef.current = [];
            setIsPlaying(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            oscillatorsRef.current.forEach((osc) => {
                try {
                    osc.stop();
                } catch {
                    // Already stopped
                }
            });
            audioContextRef.current?.close();
        };
    }, []);

    return (
        <motion.button
            onClick={toggleSound}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--background)] flex items-center justify-center transition-colors duration-300 hover:border-[var(--foreground)]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle sound"
        >
            <AnimatePresence mode="wait">
                {isPlaying ? (
                    <motion.svg
                        key="sound-on"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--foreground)]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </motion.svg>
                ) : (
                    <motion.svg
                        key="sound-off"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--foreground)]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="22" y1="9" x2="16" y2="15" />
                        <line x1="16" y1="9" x2="22" y2="15" />
                    </motion.svg>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
