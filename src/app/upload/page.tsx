"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaUpload, FaMagic, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { RootState } from "../store/store";
import { uploadMeme, deleteMeme, editMemeCaption } from "../store/slices/memeSlice";

const AI_CAPTIONS = [
    "When you realize it's Monday again... 😩",
    "That moment when WiFi stops working 😱",
    "Me after one gym session 💪😂",
    "Trying to act normal after tripping in public 😅",
    "When your code works on the first try! 🚀",
    "Me waiting for food delivery like... 🍕",
    "That awkward moment when you wave back at someone who wasn’t waving at you 😳",
    "When you realize you've been on your phone for 3 hours straight 📱😂",
];

export default function UploadMeme() {
    const dispatch = useDispatch();
    const uploadedMemes = useSelector((state: RootState) => state.memes.uploadedMemes);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [memeCaption, setMemeCaption] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);
    const [editMode, setEditMode] = useState<string | null>(null);
    const [editedCaption, setEditedCaption] = useState("");
    const [hydrated, setHydrated] = useState(false);
    const [generatedId, setGeneratedId] = useState("");

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) {
            setGeneratedId(`${Date.now()}-${Math.random()}`);
        }
    }, [hydrated]);

    // Handle File Selection & Preview
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedFile(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate AI Caption (Changes Every Time)
    const generateAICaption = () => {
        setLoadingAI(true);
        setTimeout(() => {
            const randomCaption = AI_CAPTIONS[Math.floor(Math.random() * AI_CAPTIONS.length)];
            setMemeCaption(randomCaption);
            setLoadingAI(false);
        }, 1000);
    };

    // Upload Meme
    const handleSubmit = () => {
        if (!selectedFile) return alert("Please upload an image!");

        const newMeme = {
            id: generatedId, 
            name: "Custom Meme",
            url: selectedFile,
            caption: memeCaption,
            likes: 0,
            comments: Math.floor(Math.random() * 50) + 5,
            date: new Date().toISOString(),
        };

        dispatch(uploadMeme(newMeme));
        setSelectedFile(null);
        setMemeCaption("");
        alert("Meme uploaded successfully! 🎉");
    };

    // Cancel Upload
    const handleCancel = () => {
        setSelectedFile(null);
        setMemeCaption("");
    };

    // Delete Meme
    const handleDelete = (id: string) => {
        dispatch(deleteMeme(id));
    };

    // Edit Meme
    const handleEdit = (id: string, newCaption: string) => {
        dispatch(editMemeCaption({ id, newCaption }));
        setEditMode(null);
    };

    if (!hydrated) return null;

    return (
        <motion.div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-white">

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold tracking-normal bg-clip-text text-transparent text-center inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2">
                    Upload Memes   <span className="text-red-500">🎭</span>
                </h1>

            </div>

            {/* Upload Button */}
            <div className="mt-6 flex justify-center">
                <label className="cursor-pointer bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg text-white flex items-center gap-2">
                    <FaUpload /> Select Meme
                    <input type="file" accept="image/*,image/gif" onChange={handleFileSelect} className="hidden" />
                </label>
            </div>

            {/* Preview & Caption Input */}
            {selectedFile && (
                <div className="mt-6 flex flex-col items-center">
                    <motion.img src={selectedFile} alt="Preview" className="w-96 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }} />
                    <textarea
                        className="mt-4 w-full max-w-lg p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700"
                        placeholder="Add your funny caption..."
                        value={memeCaption}
                        onChange={(e) => setMemeCaption(e.target.value)}
                    />
                    <div className="mt-3 flex gap-3">
                        <button
                            onClick={generateAICaption}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                            disabled={loadingAI}
                        >
                            {loadingAI ? "Generating..." : <><FaMagic /> Generate AI Caption</>}
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Upload Meme 
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            <FaTimes /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Display Uploaded Memes */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">My Uploaded Memes 📤</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {uploadedMemes.map((meme) => (
                    <motion.div key={meme.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl relative overflow-hidden hover:scale-105 transition">
                        <motion.img whileHover={{ scale: 1.05 }} src={meme.url} alt={meme.name} className="w-full h-52 object-cover rounded-lg" />
                        {editMode === meme.id ? (
                            <input
                                className="w-full p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 mt-2"
                                value={editedCaption}
                                onChange={(e) => setEditedCaption(e.target.value)}
                            />
                        ) : (
                            <p className="text-center text-gray-700 dark:text-gray-300 mt-2">{meme.caption || "No caption"}</p>
                        )}
                        <div className="flex justify-between items-center text-white mt-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <button onClick={() => handleDelete(meme.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                            {editMode === meme.id ? (
                                <button onClick={() => handleEdit(meme.id, editedCaption)} className="text-green-500 hover:text-green-700">✅</button>
                            ) : (
                                <button onClick={() => { setEditMode(meme.id); setEditedCaption(meme.caption); }} className="text-blue-500 hover:text-blue-700"><FaEdit /></button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
