"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMemes, toggleLike } from "./store/slices/memeSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaComment, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { MemeApiResponse } from "@/types";
import { RootState } from "./store/store";

export default function Home() {
  const dispatch = useDispatch();
  const memes = useSelector((state: RootState) => state.memes.allMemes);
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const [showHeart, setShowHeart] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (memes.length === 0 && hydrated) {
      axios.get<MemeApiResponse>("https://api.imgflip.com/get_memes")
        .then((res) => {
          const memesWithExtraData = res.data.data.memes.map((meme) => ({
            ...meme,
            likes: Math.floor(Math.random() * 500) || 0,
            comments: Math.floor(Math.random() * 100) || 0,
            date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString() || "N/A",
          }));
          dispatch(setMemes(memesWithExtraData));
        })
        .catch(() => console.error("Failed to load memes."));
    }
  }, [dispatch, memes.length, hydrated]);

  if (!hydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-6 bg-gray-50 dark:bg-gray-900`}
    >

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-normal bg-clip-text text-transparent text-center inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2">
          Trending Memes <span className="text-red-500">🔥</span>
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Dive into a world of laughter and trending memes!
        </p>
      </div>

      {memes.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="p-4 rounded-lg shadow-xl bg-white dark:bg-gray-800 animate-pulse">
              <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex justify-between items-center mt-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {memes.slice(0, 12).map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-4 rounded-lg shadow-xl relative overflow-hidden hover:scale-105 transition bg-white dark:bg-gray-800"
            >
              <Link href={`/meme/${meme.id}`} className="block">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Image
                    src={meme.url}
                    alt={meme.name}
                    loading="lazy"
                    width={500} height={500}
                    className="w-full h-52 object-cover rounded-lg"

                  />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3 text-center">{meme.name}</h3>
                </motion.div>
              </Link>

              <AnimatePresence mode="popLayout">
                {showHeart === meme.id && (
                  <motion.div
                    key={meme.id}
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

              <div className="flex justify-between items-center mt-4 p-2 rounded-lg text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700">
                <button
                  onClick={() => {
                    dispatch(toggleLike(meme.id));
                    setShowHeart(meme.id);
                    setTimeout(() => setShowHeart(null), 600);
                  }}
                  className="flex items-center gap-1 text-lg focus:outline-none"
                >
                  {likedMemes.some((likedMeme) => likedMeme.id === meme.id) ? (
                    <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                      <FaHeart className="text-red-500 hover:scale-125 transition" />
                    </motion.div>
                  ) : (
                    <FaRegHeart className="hover:scale-125 transition" />
                  )}
                  <span className="ml-1">{meme.likes}</span>
                </button>

                <p className="flex items-center gap-1">
                  <FaComment className="text-blue-400" /> {meme.comments}
                </p>
                <p className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-500" /> {meme.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}