"use client";

import { motion } from "framer-motion";

interface ContactSectionProps {
    linkedinUrl?: string;
    email?: string;
    githubUrl?: string;
}

export default function ContactSection({
    linkedinUrl = "https://www.linkedin.com/in/shadabriyaztango/",
    email,
    githubUrl,
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
                {/* Email Link */}
                {email && (
                    <>
                        <motion.a
                            href={`mailto:${email}`}
                            className="text-xs md:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-300"
                            whileHover={{ x: 3 }}
                        >
                            Email
                        </motion.a>
                        <span className="mx-4 text-[var(--muted)]">/</span>
                    </>
                )}

                {/* LinkedIn Link */}
                <motion.a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-300"
                    whileHover={{ x: 3 }}
                >
                    LinkedIn
                </motion.a>

                {/* GitHub Link */}
                {githubUrl && (
                    <>
                        <span className="mx-4 text-[var(--muted)]">/</span>
                        <motion.a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs md:text-sm uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-300"
                            whileHover={{ x: 3 }}
                        >
                            GitHub →
                        </motion.a>
                    </>
                )}
            </div>
        </motion.footer>
    );
}
