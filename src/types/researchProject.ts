export interface FlightAssets {
    model: string;
    poster: string;
    viewer_url: string;
}

export interface ResearchProjectSection {
    title: string;
    content: string;
}

export interface ResearchProjectConfig {
    flight?: FlightAssets;
    title: string;
    subtitle?: string;
    category: string;
    image?: string;
    summary: string;
    sections: ResearchProjectSection[];
    related_publications_category: string;
}
