'use client';
import type { ResearchProjectConfig } from '@/types/researchProject';
import FlightExperience from './FlightExperience';
import ResearchWorkflow from './ResearchWorkflow';

export default function ProjectVisuals({ project }: { project: ResearchProjectConfig }) {
    return <div className="mb-8 space-y-7">
        {project.flight && !project.workflow && <FlightExperience assets={project.flight} preview />}
        {project.workflow && <ResearchWorkflow content={project.workflow} flight={project.flight} />}
    </div>;
}
