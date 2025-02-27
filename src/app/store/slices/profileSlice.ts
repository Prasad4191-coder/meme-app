import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
    name: string;
    bio: string;
    profilePicture: string;
}

const initialState: { userProfile: UserProfile } = {
    userProfile: {
        name: "User",
        bio: "This is my meme collection!",
        profilePicture: "/default-avatar.png",
    }
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        updateProfile: (state, action: PayloadAction<UserProfile>) => {
            state.userProfile = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("userProfile", JSON.stringify(action.payload)); // Save only in browser
            }
        },
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.userProfile = action.payload;
        }
    }
});

export const { updateProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;
