"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export default function TypewriterText({
    phrases,
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseDuration = 2000,
}: TypewriterTextProps) {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[currentPhraseIndex];

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    // Typing
                    if (currentText.length < currentPhrase.length) {
                        setCurrentText(currentPhrase.slice(0, currentText.length + 1));
                    } else {
                        // Finished typing, pause then delete
                        setTimeout(() => setIsDeleting(true), pauseDuration);
                    }
                } else {
                    // Deleting
                    if (currentText.length > 0) {
                        setCurrentText(currentText.slice(0, -1));
                    } else {
                        // Finished deleting, move to next phrase
                        setIsDeleting(false);
                        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
                    }
                }
            },
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className="inline-flex items-center">
            <AnimatePresence mode="wait">
                {currentText.split("").map((char, index) => (
                    <motion.span
                        key={`${currentPhraseIndex}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.1 }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </AnimatePresence>
            <span className="cursor-blink ml-0.5 text-[var(--accent)]">|</span>
        </span>
    );
}
