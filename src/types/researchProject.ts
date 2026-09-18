export interface ResearchProjectSection {
    title: string;
    content: string;
}

export interface ResearchProjectConfig {
    title: string;
    subtitle?: string;
    category: string;
    image?: string;
    summary: string;
    sections: ResearchProjectSection[];
    related_publications_category: string;
}
