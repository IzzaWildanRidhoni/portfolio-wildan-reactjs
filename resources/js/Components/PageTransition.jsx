import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';

const variants = {
    fadeUp: {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2, ease: 'easeIn' },
        },
    },
};

export default function PageTransition({ children }) {
    const { url } = usePage();

    // ✅ Ambil hanya pathname, buang query string
    const pathname = url.split('?')[0];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                variants={variants.fadeUp}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}