"use client";

import { motion } from "framer-motion";

interface ContactSectionProps {
    linkedinUrl?: string;
}

export default function ContactSection({
    linkedinUrl = "https://www.linkedin.com/in/shadabriyaztango/",
}: ContactSectionProps) {
    return (
        <motion.footer
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
        >
            <div
                className="flex justify-start items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6"
                style={{ fontFamily: "var(--font-code)" }}
            >
                {/* Contact Link */}
                <motion.a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-300"
                    whileHover={{ x: 3 }}
                >
                    Contact →
                </motion.a>
            </div>
        </motion.footer>
    );
}
