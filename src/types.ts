export interface Meme {
    id: string;
    name: string;
    url: string;
    caption: string;
    likes: number;
    comments: number;
    date: string;
}


export interface MemeApiResponse {
    success: boolean;
    data: {
        memes: Meme[];
    };
}
