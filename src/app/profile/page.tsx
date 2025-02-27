"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaCalendarAlt } from "react-icons/fa";
import { RootState } from "../store/store";
import { setProfile, updateProfile } from "../store/slices/profileSlice";
import Image from "next/image";

export default function Profile() {
    const dispatch = useDispatch();
    const profileFromStore = useSelector((state: RootState) => state.profile.userProfile);
    const uploadedMemes = useSelector((state: RootState) => state.memes.uploadedMemes);
    const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);

    const [hydrated, setHydrated] = useState(false); // Prevent SSR Mismatch
    const [profile, setProfileState] = useState(profileFromStore);
    const [editProfile, setEditProfile] = useState(false);
    const [newProfile, setNewProfile] = useState(profileFromStore);

    // Mark Component as Hydrated
    useEffect(() => {
        setHydrated(true);
        if (typeof window !== "undefined") {
            const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
            if (storedProfile.name) {
                dispatch(setProfile(storedProfile));
                setProfileState(storedProfile);
            }
        }
    }, [dispatch]);

    // Prevent SSR Mismatch - Don't Render Until Hydrated
    if (!hydrated) return null;

    // Save profile changes
    const saveProfile = () => {
        dispatch(updateProfile(newProfile)); // Update Redux
        localStorage.setItem("userProfile", JSON.stringify(newProfile)); // Save to Local Storage
        toast.success("Profile updated successfully!", { position: "top-center" });
        setEditProfile(false);
        setProfileState(newProfile); // Update local state
    };

    // Handle profile picture upload
    const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewProfile((prev) => ({ ...prev, profilePicture: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen p-6">
            {/* User Profile Section */}
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <Image src={profile.profilePicture} alt="Profile" width={500} height={500} className="w-24 h-24 rounded-full border border-gray-300" />
                {editProfile ? (
                    <>
                        <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="mt-2 text-sm text-gray-500" />
                        <input type="text" value={newProfile.name} onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                            className="mt-2 p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 w-full" />
                        <textarea value={newProfile.bio} onChange={(e) => setNewProfile({ ...newProfile, bio: e.target.value })}
                            className="mt-2 p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-700 w-full" />
                        <button onClick={saveProfile} className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            Save Profile ✅
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{profile.name}</h2>
                        <p className="text-center text-gray-500 dark:text-gray-400">{profile.bio}</p>
                        <button onClick={() => setEditProfile(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                            Edit Profile ✏️
                        </button>
                    </>
                )}
            </div>

            {/* Uploaded Memes Section */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">My Uploaded Memes 🎭</h2>
            {uploadedMemes.length === 0 ? (
                <p className="text-center mt-6 text-gray-500">No memes uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {uploadedMemes.map((meme) => (
                        <motion.div key={meme.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
                            <Image src={meme.url} alt="Meme" width={500} height={500} className="w-full h-52 object-cover rounded-lg" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3 text-center">{meme.caption}</h3>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Liked Memes Section */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Liked Memes ❤️</h2>
            {likedMemes.length === 0 ? (
                <p className="text-center mt-6 text-gray-500">No liked memes yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {likedMemes.map((meme) => (
                        <motion.div key={meme.id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
                            <Image src={meme.url} alt="Liked Meme" width={500} height={500} className="w-full h-52 object-cover rounded-lg" />
                            <div className="flex justify-between items-center mt-2 px-2 text-gray-900 dark:text-white">
                                <p className="flex items-center gap-1"><FaHeart className="text-red-500" /> {meme.likes}</p>
                                <p className="flex items-center gap-1"><FaCalendarAlt className="text-gray-500" /> {meme.date}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Toast Notifications */}
            <ToastContainer />
        </motion.div>
    );
}
