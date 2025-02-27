"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { RootState } from "../store/store";

export default function Leaderboard() {
    const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
    const [topMemes, setTopMemes] = useState<typeof likedMemes>([]);
    const [hydrated, setHydrated] = useState(false); // Fix SSR issues

    useEffect(() => {
        setHydrated(true); // Mark hydration complete
    }, []);

    useEffect(() => {
        if (hydrated) {
            // Sort memes by likes only after hydration (Fixes SSR Mismatch)
            const sortedMemes = [...likedMemes].sort((a, b) => b.likes - a.likes);
            setTopMemes(sortedMemes.slice(0, 10)); // Get top 10 memes
        }
    }, [likedMemes, hydrated]);

    // Hide UI until hydration is complete
    if (!hydrated) return null;

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen p-6">
        
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold tracking-normal bg-clip-text text-transparent text-center inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2">
                    <span className="text-red-500">🔥</span>  Meme Leaderboard  <span className="text-red-500">🔥</span>
                </h1>

            </div>

            {topMemes.length === 0 ? (
                <p className="text-center mt-6 text-gray-500">No memes available. Try liking some memes! ❤️</p>
            ) : (
                <div className="mt-8 space-y-4 max-w-3xl mx-auto">
                    {topMemes.map((meme, index) => (
                        <Link key={meme.id} href={`/meme/${meme.id}`} className="block">
                            <motion.div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg flex items-center gap-4 cursor-pointer hover:scale-105 transition"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{index + 1}.</span>
                                <img src={meme.url} alt={meme.name} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{meme.name}</h2>
                                </div>
                                <p className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <FaHeart className="text-red-500" /> {meme.likes}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
