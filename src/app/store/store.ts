"use client";
import { configureStore } from "@reduxjs/toolkit";
import memeReducer from "./slices/memeSlice";
import profileReducer from "./slices/profileSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
    reducer: {
        memes: memeReducer,
        profile: profileReducer,
        theme: themeReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
