import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Meme {
    id: string;
    name: string;
    url: string;
    caption: string;
    likes: number;
    comments: number;
    date: string;
}

interface MemeState {
    allMemes: Meme[];
    likedMemes: Meme[];
    uploadedMemes: Meme[];
}

const loadFromLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window !== "undefined") {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : defaultValue;
    }
    return defaultValue;
};

const initialState: MemeState = {
    allMemes: loadFromLocalStorage("allMemes", []).map((m: Meme) => ({
        ...m,
        caption: m.caption || "",
    })),
    likedMemes: loadFromLocalStorage("likedMemes", []).map((m: Meme) => ({
        ...m,
        caption: m.caption || "",
    })),
    uploadedMemes: loadFromLocalStorage("uploadedMemes", []).map((m: Meme) => ({
        ...m,
        caption: m.caption || "",
    })),
};

const memeSlice = createSlice({
    name: "memes",
    initialState,
    reducers: {
        setMemes: (state, action: PayloadAction<Meme[]>) => {
            state.allMemes = action.payload.map(meme => ({
                ...meme,
                caption: meme.caption || "No caption",
            }));
            if (typeof window !== "undefined") {
                localStorage.setItem("allMemes", JSON.stringify(state.allMemes));
            }
        },
        toggleLike: (state, action: PayloadAction<string>) => {
            const memeIndex = state.allMemes.findIndex(m => m.id === action.payload);
            if (memeIndex !== -1) {
                const meme = state.allMemes[memeIndex];
                if (state.likedMemes.some(m => m.id === meme.id)) {
                    state.likedMemes = state.likedMemes.filter(m => m.id !== meme.id);
                    meme.likes -= 1;
                } else {
                    state.likedMemes.push(meme);
                    meme.likes += 1;
                }
            }
            if (typeof window !== "undefined") {
                localStorage.setItem("likedMemes", JSON.stringify(state.likedMemes));
            }
        },
        uploadMeme: (state, action: PayloadAction<Meme>) => {
            state.uploadedMemes.push(action.payload);
            if (typeof window !== "undefined") {
                localStorage.setItem("uploadedMemes", JSON.stringify(state.uploadedMemes));
            }
        },
        deleteMeme: (state, action: PayloadAction<string>) => {
            state.uploadedMemes = state.uploadedMemes.filter(meme => meme.id !== action.payload);
            if (typeof window !== "undefined") {
                localStorage.setItem("uploadedMemes", JSON.stringify(state.uploadedMemes));
            }
        },
        editMemeCaption: (state, action: PayloadAction<{ id: string, newCaption: string }>) => {
            const meme = state.uploadedMemes.find(m => m.id === action.payload.id);
            if (meme) {
                meme.caption = action.payload.newCaption;
            }
            if (typeof window !== "undefined") {
                localStorage.setItem("uploadedMemes", JSON.stringify(state.uploadedMemes));
            }
        },
        setLikedMemes: (state, action: PayloadAction<Meme[]>) => {
            state.likedMemes = action.payload;
        },
        setUploadedMemes: (state, action: PayloadAction<Meme[]>) => {
            state.uploadedMemes = action.payload;
        }
    }
});

export const { setMemes, toggleLike, uploadMeme, deleteMeme, editMemeCaption, setLikedMemes, setUploadedMemes } = memeSlice.actions;
export default memeSlice.reducer;
