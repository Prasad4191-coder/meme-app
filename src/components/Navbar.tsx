"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string>("/default-avatar.png"); // Default avatar

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }

        const syncDarkMode = () => {
            const updatedTheme = localStorage.getItem("theme") === "dark";
            setDarkMode(updatedTheme);
            document.documentElement.classList.toggle("dark", updatedTheme);
        };

        window.addEventListener("storage", syncDarkMode);

        const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        if (savedProfile.profilePicture) {
            setProfilePicture(savedProfile.profilePicture);
        }

        return () => {
            window.removeEventListener("storage", syncDarkMode);
        };
    }, []);

    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        setDarkMode(!darkMode);

        window.dispatchEvent(new Event("storage"));
    };

    return (
        <nav className="bg-white dark:bg-gray-900 p-4 shadow-md">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Centered Title */}
                <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                    MemeVerse
                </Link>

                {/* Navigation Links & Dark Mode Toggle */}
                <div className="flex items-center gap-4">
                    <Link href="/explore" className="text-gray-900 dark:text-white hover:underline">
                        Explore
                    </Link>
                    <Link href="/upload" className="text-gray-900 dark:text-white hover:underline">
                        Upload
                    </Link>
                    <Link href="/leaderboard" className="text-gray-900 dark:text-white hover:underline">
                        Leaderboard
                    </Link>

                    {/* Dark Mode Toggle Button */}
                    <button
                        onClick={toggleDarkMode}
                        aria-label="Toggle dark mode"
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    {/* Profile Picture on the Right */}
                    <Link href="/profile" className="flex items-center">
                        <Image
                            src={profilePicture}
                            alt="Profile"
                            width={500} height={500}
                            className="w-10 h-10 rounded-full border border-gray-300"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
