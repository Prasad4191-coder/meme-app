"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { motion } from "framer-motion";
import Link from "next/link";
import { RootState } from "./store/store";

export default function NotFoundPage() {
    const allMemes = useSelector((state: RootState) => state.memes.allMemes);
    const [randomMeme, setRandomMeme] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);


    useEffect(() => {
        setHydrated(true);
        if (allMemes.length > 0) {
            setRandomMeme(allMemes[Math.floor(Math.random() * allMemes.length)].url);
        }
    }, [allMemes]);

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen flex flex-col items-center justify-center p-6">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Oops! 🤦‍♂️</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">We couldn’t find that page...</p>

            {hydrated && randomMeme ? (
                <img src={randomMeme} alt="Random Meme" className="mt-6 w-96 h-auto rounded-lg shadow-lg" />
            ) : (
                <img src="https://media.giphy.com/media/hECJDGJs4hQjjWLqRV/giphy.gif" alt="404 Error GIF" className="mt-6 w-96 h-auto rounded-lg shadow-lg" />
            )}

            <Link href="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Go Back Home 🏠
            </Link>
        </motion.div>
    );
}
