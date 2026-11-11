export interface FlightAssets {
    model: string;
    poster: string;
    viewer_url: string;
}

export interface ResearchProjectSection {
    title: string;
    content: string;
}

export type WorkflowStepId = 'sensing' | 'features' | 'ml' | 'dl' | 'gwas' | 'selection' | 'applications';

export interface ResearchWorkflowContent {
    title: string;
    introduction: string;
    feature_path_label: string;
    image_path_label: string;
    genomic_input_label: string;
    genomic_input_description: string;
    steps: { id: WorkflowStepId; label: string; description: string; application: string }[];
}

export interface ResearchProjectConfig {
    workflow?: ResearchWorkflowContent;
    flight?: FlightAssets;
    visualization?: 'forest-health';
    title: string;
    subtitle?: string;
    category: string;
    image?: string;
    summary: string;
    sections: ResearchProjectSection[];
    related_publications_category?: string;
    related_publications_categories?: string[];
}
