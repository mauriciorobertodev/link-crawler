export type Link = {
    title: string;
    url: string;
    completed: boolean;
    status: number;
    reason: string | null;
};

export type ScrappingData = Link[];
