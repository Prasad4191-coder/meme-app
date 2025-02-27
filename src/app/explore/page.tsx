"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import _ from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaComment, FaCalendarAlt, FaSearch, FaFilter, FaSort } from "react-icons/fa";
import Link from "next/link";
import { MemeApiResponse } from "@/types";
import { RootState } from "../store/store";
import { setMemes, toggleLike } from "../store/slices/memeSlice";
import React from "react";

// Sorting and filter options
const sortOptions = ["Likes", "Date", "Comments"];
const categories = ["Trending", "New", "Classic", "Random"];


export default function ExploreMemes() {
    const dispatch = useDispatch();
    const memes = useSelector((state: RootState) => state.memes.allMemes);
    const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);

    const [hydrated, setHydrated] = useState(false); // Hydration check
    const [sortBy, setSortBy] = useState<string>("Likes");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Trending");
    const [showHeart, setShowHeart] = useState<string | null>(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const memesPerPage = 12;

    // Ensure Hydration Completes Before Rendering (Fix SSR Issues)
    useEffect(() => {
        setHydrated(true);
    }, []);

    // Fetch Memes After Hydration (Fixes Server-Client Mismatch)
    useEffect(() => {
        if (memes.length === 0 && hydrated) {
            axios.get<MemeApiResponse>("https://api.imgflip.com/get_memes")
                .then((res) => {
                    const memesWithExtraData = res.data.data.memes.map((meme) => ({
                        ...meme,
                        likes: Math.floor(Math.random() * 500) + 50, // Random values set on client
                        comments: Math.floor(Math.random() * 100) + 5,
                        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
                    }));
                    dispatch(setMemes(memesWithExtraData));
                })
                .catch(() => console.error("Failed to fetch memes."));
        }
    }, [dispatch, memes.length, hydrated]);

    // Prevent SSR Mismatch - Don't Render Until Hydrated
    if (!hydrated) return null;

    // Search functionality with debounce
    const debouncedSearch = _.debounce((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, 300);

    // Filter and sort memes based on user selection
    const filteredMemes = memes
        .filter((meme) => meme.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            switch (sortBy) {
                case "Likes": return b.likes - a.likes;
                case "Date": return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "Comments": return b.comments - a.comments;
                default: return 0;
            }
        });

    // Paginate memes
    const totalPages = Math.ceil(filteredMemes.length / memesPerPage);
    const paginatedMemes = filteredMemes.slice((currentPage - 1) * memesPerPage, currentPage * memesPerPage);

    return (
        <motion.div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold tracking-normal bg-clip-text text-transparent text-center inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2">
                    Explore Memes  <span className="text-red-500">🔥</span>
                </h1>

            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="relative">
                    <FaFilter className="absolute left-3 top-3 text-gray-500" />
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none">
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <FaSort className="absolute left-3 top-3 text-gray-500" />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none">
                        {sortOptions.map((option) => (
                            <option key={option} value={option}>Sort by {option}</option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-500" />
                    <input type="text" placeholder="Search memes..." onChange={(e) => debouncedSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none" />
                </div>
            </div>

            {/* Meme Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedMemes.map((meme) => (
                    <motion.div key={meme.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
                        {/* Floating Heart Animation */}
                        <AnimatePresence mode="popLayout">
                            {showHeart === meme.id && (
                                <motion.div
                                    key={meme.id} // Ensures animation updates properly
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.5 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <FaHeart className="text-red-500 text-7xl opacity-75 drop-shadow-lg" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Link href={`/meme/${meme.id}`}>
                            <motion.img src={meme.url} alt={meme.name} className="w-full h-52 object-cover rounded-lg"
                                whileHover={{ scale: 1.05 }} />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3 text-center">{meme.name}</h3>
                        </Link>

                        <div className="flex justify-between items-center text-gray-900 dark:text-white mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button onClick={() => {
                                dispatch(toggleLike(meme.id));
                                setShowHeart(meme.id);
                                setTimeout(() => setShowHeart(null), 600); // Hide heart after 600ms
                            }} className="flex items-center gap-1 text-lg">
                                {likedMemes.some((likedMeme) => likedMeme.id === meme.id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                <span>{meme.likes}</span>
                            </button>
                            <p className="flex items-center gap-1"><FaComment className="text-blue-500" /> {meme.comments}</p>
                            <p className="flex items-center gap-1"><FaCalendarAlt className="text-gray-500" /> {meme.date}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                {/* Prev Button */}
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                    ← Prev
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(page =>
                        page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)
                    )
                    .map((page, index, array) => (
                        <React.Fragment key={page}>
                            {index > 0 && page !== array[index - 1] + 1 && (
                                <span key={`ellipsis-${page}`} className="px-2">...</span>
                            )}
                            <button
                                key={`page-${page}`}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg ${currentPage === page ? "bg-blue-700 text-white font-bold" : "bg-gray-300 hover:bg-gray-400"}`}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    ))}

                {/* Next Button */}
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                    Next →
                </button>
            </div>

        </motion.div>
    );
}
