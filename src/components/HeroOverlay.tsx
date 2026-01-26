"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import NameSequenceTyper from "./NameSequenceTyper";

export default function HeroOverlay() {
    const [showTagline, setShowTagline] = useState(false);

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Center Left - Name Block */}
            <motion.div
                className="absolute top-1/4 sm:top-1/3 left-4 sm:left-8 md:left-12 lg:left-16 right-4 sm:right-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <NameSequenceTyper onComplete={() => setTimeout(() => setShowTagline(true), 2000)} />

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: showTagline ? 1 : 0, y: showTagline ? 0 : 10 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mt-8 sm:mt-12 max-w-lg"
                >
                    <p className="text-sm sm:text-base text-[var(--muted)] font-bold tracking-wide leading-relaxed" style={{ fontFamily: "var(--font-code)" }}>
                        For the Infinite Beta.
                        <span className="block mt-1 font-normal opacity-80">
                            Exploring the edge of what’s possible today.
                        </span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
