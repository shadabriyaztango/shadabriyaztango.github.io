"use client";

import { useEffect, useRef } from "react";

export default function GrainTexture() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        canvas.width = 256;
        canvas.height = 256;

        // Generate noise pattern
        const generateNoise = () => {
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * 255;
                data[i] = noise;     // R
                data[i + 1] = noise; // G
                data[i + 2] = noise; // B
                data[i + 3] = 15;    // A (very subtle)
            }

            ctx.putImageData(imageData, 0, 0);
        };

        // Animate grain
        let animationId: number;
        const animate = () => {
            generateNoise();
            animationId = requestAnimationFrame(animate);
        };

        // Run at lower frame rate to reduce CPU usage
        const interval = setInterval(() => {
            generateNoise();
        }, 100);

        return () => {
            clearInterval(interval);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[100] pointer-events-none opacity-30 mix-blend-overlay"
            style={{
                backgroundImage: `url(${canvasRef.current?.toDataURL() || ""})`,
                backgroundRepeat: "repeat",
            }}
        >
            <canvas ref={canvasRef} className="hidden" />
            {/* CSS-based grain fallback */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    opacity: 0.4,
                }}
            />
        </div>
    );
}
