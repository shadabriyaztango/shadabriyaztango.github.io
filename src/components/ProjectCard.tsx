"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
    title: string;
    category: string;
    description: string;
    href?: string;
}

export default function ProjectCard({
    title,
    category,
    description,
    href = "#",
}: ProjectCardProps) {
    return (
        <motion.a
            href={href}
            className="group block border-b border-[var(--muted)]/30 py-8 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {/* Category Tag */}
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-2 block">
                {category}
            </span>

            {/* Title Row */}
            <div className="flex items-center justify-between">
                <motion.h3
                    className="text-2xl md:text-4xl font-light tracking-tight"
                    whileHover={{ fontStyle: "italic", x: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    {title}
                </motion.h3>

                {/* Arrow that slides in on hover */}
                <motion.span
                    className="text-[var(--accent)] text-2xl opacity-0 -translate-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    →
                </motion.span>
            </div>

            {/* Description - expands on hover */}
            <motion.p
                className="text-[var(--muted)] mt-4 max-w-xl overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                whileHover={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {description}
            </motion.p>
        </motion.a>
    );
}
