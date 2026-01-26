"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handlePointerCheck = () => {
            const hoveredElement = document.elementFromPoint(
                mousePosition.x,
                mousePosition.y
            );
            if (hoveredElement) {
                const computed = window.getComputedStyle(hoveredElement);
                setIsPointer(
                    computed.cursor === "pointer" ||
                    hoveredElement.tagName === "A" ||
                    hoveredElement.tagName === "BUTTON"
                );
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mouseenter", handleMouseEnter);
        window.addEventListener("mouseover", handlePointerCheck);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("mouseover", handlePointerCheck);
        };
    }, [mousePosition.x, mousePosition.y]);

    // Only show on non-touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
        return null;
    }

    return (
        <>
            {/* Hide default cursor */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                    scale: isPointer ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5,
                }}
                style={{
                    opacity: isVisible ? 1 : 0,
                }}
            >
                <div
                    className="w-2 h-2 bg-[var(--foreground)] rounded-full"
                    style={{
                        boxShadow: "0 0 10px var(--foreground)",
                    }}
                />
            </motion.div>

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 z-[9998] pointer-events-none"
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: isPointer ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
                style={{
                    opacity: isVisible ? 0.5 : 0,
                }}
            >
                <div
                    className="w-10 h-10 border border-[var(--foreground)] rounded-full"
                    style={{
                        borderStyle: "dashed",
                    }}
                />
            </motion.div>

            {/* Trailing brackets - nerdy touch */}
            <motion.div
                className="fixed top-0 left-0 z-[9997] pointer-events-none font-mono text-xs text-[var(--muted)]"
                animate={{
                    x: mousePosition.x + 15,
                    y: mousePosition.y - 8,
                }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                }}
                style={{
                    opacity: isVisible && isPointer ? 0.7 : 0,
                    fontFamily: "var(--font-code)",
                }}
            >
                {"</>"}
            </motion.div>
        </>
    );
}
