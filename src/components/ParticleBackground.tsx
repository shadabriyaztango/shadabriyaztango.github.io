"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Particle {
    x: number;
    y: number;
    radius: number;
    angle: number;
    speed: number;
    orbitRadius: number;
    opacity: number;
    size: number;
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Center point
        const centerX = () => canvas.width / 2;
        const centerY = () => canvas.height / 2;

        // Initialize particles
        const particleCount = 80;
        particlesRef.current = [];

        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push({
                x: 0,
                y: 0,
                radius: Math.random() * 2 + 1,
                angle: Math.random() * Math.PI * 2,
                speed: (Math.random() * 0.002 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
                orbitRadius: Math.random() * Math.min(canvas.width, canvas.height) * 0.4 + 50,
                opacity: Math.random() * 0.5 + 0.3,
                size: Math.random() * 2 + 1,
            });
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Colors based on theme
            const particleColor = theme === "dark" ? "255, 255, 255" : "0, 0, 0";
            const glowColor = theme === "dark" ? "100, 200, 255" : "50, 100, 200";

            // Draw center glow
            const gradient = ctx.createRadialGradient(
                centerX(),
                centerY(),
                0,
                centerX(),
                centerY(),
                150
            );
            gradient.addColorStop(0, `rgba(${glowColor}, 0.1)`);
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw particles
            particlesRef.current.forEach((particle) => {
                // Update angle for orbit
                particle.angle += particle.speed;

                // Calculate position
                particle.x = centerX() + Math.cos(particle.angle) * particle.orbitRadius;
                particle.y = centerY() + Math.sin(particle.angle) * particle.orbitRadius;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${particleColor}, ${particle.opacity})`;
                ctx.fill();

                // Draw glow
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                const particleGlow = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size * 3
                );
                particleGlow.addColorStop(0, `rgba(${glowColor}, ${particle.opacity * 0.3})`);
                particleGlow.addColorStop(1, "transparent");
                ctx.fillStyle = particleGlow;
                ctx.fill();
            });

            // Draw connecting lines between nearby particles
            particlesRef.current.forEach((p1, i) => {
                particlesRef.current.slice(i + 1).forEach((p2) => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${particleColor}, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}
