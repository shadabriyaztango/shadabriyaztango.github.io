"use client";

import { motion } from "framer-motion";
import NameSequenceTyper from "./NameSequenceTyper";

export default function HeroOverlay() {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Center Left - Name Block */}
            <motion.div
                className="absolute top-1/4 sm:top-1/3 left-4 sm:left-8 md:left-12 lg:left-16 right-4 sm:right-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <NameSequenceTyper />
            </motion.div>
        </div>
    );
}
