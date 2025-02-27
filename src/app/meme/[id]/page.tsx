"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Meme, MemeApiResponse } from "@/types";
import { RootState } from "@/app/store/store";
import { setMemes, toggleLike } from "@/app/store/slices/memeSlice";
import Image from "next/image";

export default function MemeDetails() {
    const { id } = useParams(); // Get meme ID from URL
    const dispatch = useDispatch();
    const memes = useSelector((state: RootState) => state.memes.allMemes);
    const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);

    const [meme, setMeme] = useState<Meme | null>(null);
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState("");

    // Load meme data
    useEffect(() => {
        const foundMeme = memes.find((m) => m.id === id);

        if (foundMeme) {
            setMeme(foundMeme);
        } else {
            axios.get<MemeApiResponse>("https://api.imgflip.com/get_memes")
                .then((res) => {
                    const memesWithExtraData = res.data.data.memes.map((meme) => ({
                        ...meme,
                        caption: meme.caption || "", // Ensure caption exists
                        likes: Math.floor(Math.random() * 500) + 50,
                        comments: Math.floor(Math.random() * 100) + 5,
                        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
                    }));
                    dispatch(setMemes(memesWithExtraData));
                    const newlyFetchedMeme = memesWithExtraData.find((m) => m.id === id);
                    setMeme(newlyFetchedMeme || null);
                })
                .catch(() => console.error("Failed to fetch meme."));
        }

        // Ensure comments are loaded from Local Storage
        if (typeof window !== "undefined") {
            const savedComments = JSON.parse(localStorage.getItem(`comments-${id}`) || "[]");
            setComments(savedComments);
        }
    }, [dispatch, memes, id]);

    // Toggle Like
    const handleToggleLike = () => {
        if (!meme) return;
        dispatch(toggleLike(meme.id));

        toast.success(
            likedMemes.some((likedMeme) => likedMeme.id === meme.id) ?
                "Meme unliked!" :
                "Meme liked! ❤️"
        );
    };

    // Add a Comment
    const addComment = () => {
        if (!newComment.trim()) return;

        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setNewComment("");

        localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
        toast.success("Comment added! 💬");
    };

    // Share Meme
    const shareMeme = () => {
        const memeLink = `${window.location.origin}/meme/${id}`;
        navigator.clipboard.writeText(memeLink);
        toast.info("Meme link copied! 📎");
    };

    if (!meme) return <p className="text-center mt-10">Loading meme...</p>;

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen p-6">
            <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">{meme.name}</h1>

            <div className="flex flex-col items-center mt-6">
                <div className="relative w-full max-w-lg rounded-lg overflow-hidden">
                    <Image src={meme.url} alt={meme.name} width={500} height={500} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                    <button onClick={handleToggleLike} className="absolute bottom-2 right-2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md">
                        {likedMemes.some((likedMeme) => likedMeme.id === meme.id) ? (
                            <FaHeart className="text-red-500 text-2xl" />
                        ) : (
                            <FaRegHeart className="text-gray-600 dark:text-white text-2xl" />
                        )}
                    </button>
                </div>


                <p className="text-lg text-gray-700 dark:text-gray-300 mt-4 italic">{meme.caption || "No caption"}</p>

                <div className="flex gap-4 mt-4 text-gray-900 dark:text-white">
                    <span className="flex items-center gap-1"><FaHeart className="text-red-500" /> {meme.likes} Likes</span>
                    <span className="flex items-center gap-1"><FaComment className="text-blue-500" /> {comments.length} Comments</span>
                    <button onClick={shareMeme} className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md">
                        <FaShareAlt /> Share
                    </button>
                </div>

                {/* Comment Section */}
                <div className="w-full max-w-lg mt-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Comments 💬</h2>
                    <div className="mt-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center">No comments yet. Be the first! 🚀</p>
                        ) : (
                            <div className="space-y-2">
                                {comments.map((comment, index) => (
                                    <p key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                        {comment}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add a Comment */}
                    <div className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700"
                        />
                        <button onClick={addComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Comment 💬
                        </button>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </motion.div>
    );
}
