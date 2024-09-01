declare global {
    interface Window {
        scrapping: {
            startScrapping: (website: string) => void;
            stopScrapping: () => void;
        };
    }
}

export {};
