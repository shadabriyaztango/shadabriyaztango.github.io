"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
    items: string[];
    speed?: number;
}

export default function Marquee({ items, speed = 30 }: MarqueeProps) {
    const text = items.join(" • ") + " • ";
    // Duplicate for seamless loop
    const repeatedText = text.repeat(4);

    return (
        <div className="overflow-hidden whitespace-nowrap border-t border-[var(--muted)]/30 py-4">
            <motion.div
                className="inline-block font-mono text-sm uppercase tracking-[0.3em] text-[var(--muted)]"
                animate={{ x: [0, "-50%"] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
            >
                {repeatedText}
            </motion.div>
        </div>
    );
}
