"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animation with transition:
 * Phase 1: Type print("Hello, World! I am Shadab Ta[backspace]Riyaz Tango")
 * Phase 2: Transition to actual output with proper fonts
 */

interface NameSequenceTyperProps {
    onComplete?: () => void;
}

export default function NameSequenceTyper({ onComplete }: NameSequenceTyperProps) {
    const [phase, setPhase] = useState<1 | 2>(1);
    const [displayText, setDisplayText] = useState("");
    const [cursorVisible, setCursorVisible] = useState(true);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    const typingSpeed = 60;
    const deleteSpeed = 40;

    // Phase 1: Type the code
    useEffect(() => {
        if (phase !== 1) return;

        const sequence: Array<{ type: "type" | "delete" | "pause"; text?: string; count?: number; duration?: number }> = [
            { type: "type", text: 'print("Hello, World! This is ' },
            { type: "type", text: "Shadab " },
            { type: "type", text: "Ta" },
            { type: "pause", duration: 400 },
            { type: "delete", count: 2 },
            { type: "type", text: "Riyaz " },
            { type: "type", text: "Tango" },
            { type: "type", text: '")' },
        ];

        let currentText = "";
        let stepIndex = 0;
        let charIndex = 0;
        let timeoutId: NodeJS.Timeout;

        const processStep = () => {
            if (stepIndex >= sequence.length) {
                setIsTypingComplete(true);
                // Transition to phase 2 after a pause
                timeoutId = setTimeout(() => {
                    setPhase(2);
                    onComplete?.();
                }, 1500);
                return;
            }

            const step = sequence[stepIndex];

            if (step.type === "type" && step.text) {
                if (charIndex < step.text.length) {
                    currentText += step.text[charIndex];
                    setDisplayText(currentText);
                    charIndex++;
                    timeoutId = setTimeout(processStep, typingSpeed);
                } else {
                    stepIndex++;
                    charIndex = 0;
                    timeoutId = setTimeout(processStep, 50);
                }
            } else if (step.type === "delete" && step.count) {
                if (charIndex < step.count) {
                    currentText = currentText.slice(0, -1);
                    setDisplayText(currentText);
                    charIndex++;
                    timeoutId = setTimeout(processStep, deleteSpeed);
                } else {
                    stepIndex++;
                    charIndex = 0;
                    timeoutId = setTimeout(processStep, 50);
                }
            } else if (step.type === "pause" && step.duration) {
                stepIndex++;
                charIndex = 0;
                timeoutId = setTimeout(processStep, step.duration);
            }
        };

        timeoutId = setTimeout(processStep, 500);
        return () => clearTimeout(timeoutId);
    }, [phase]);

    // Cursor blink
    useEffect(() => {
        const interval = setInterval(() => setCursorVisible((v) => !v), 530);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <AnimatePresence mode="wait">
                {/* Phase 1: Code syntax */}
                {phase === 1 && (
                    <motion.p
                        key="code"
                        className="text-base sm:text-lg md:text-2xl lg:text-3xl tracking-wide text-[var(--foreground)] leading-relaxed break-words"
                        style={{ fontFamily: "var(--font-code)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        {displayText}
                        <span
                            className={`text-[var(--accent)] ${cursorVisible ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            |
                        </span>
                    </motion.p>
                )}

                {/* Phase 2: Actual output with selected fonts */}
                {phase === 2 && (
                    <motion.div
                        key="output"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Greeting in Google Sans Code */}
                        <p
                            className="text-base sm:text-lg md:text-xl lg:text-2xl tracking-wide text-[var(--muted)] mb-4 sm:mb-6"
                            style={{ fontFamily: "var(--font-code)" }}
                        >
                            Hello, World! This is
                        </p>

                        {/* Name in Press Start 2P (pixel font) */}
                        <h1
                            className="text-lg sm:text-xl md:text-3xl lg:text-4xl tracking-tight text-[var(--foreground)] leading-relaxed"
                            style={{ fontFamily: "var(--font-pixel)" }}
                        >
                            Shadab Riyaz Tango
                            <span
                                className={`text-[var(--accent)] ml-2 ${cursorVisible ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                _
                            </span>
                        </h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
