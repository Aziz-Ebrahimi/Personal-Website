'use client';
import Link from 'next/link';
import ProjectVisuals from '@/components/research/ProjectVisuals';
import type { ResearchProjectConfig } from '@/types/researchProject';
import ResearchProjectDetails from './ResearchProjectDetails';
export default function ResearchProjectPage({ project }: { project: ResearchProjectConfig }) {
 return <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
 <nav className="mb-10 text-sm" aria-label="Breadcrumb"><Link href="/research" className="font-bold text-accent hover:underline">Research</Link><span className="mx-2">/</span>{project.workflow ? project.title : project.category}</nav>
 <ProjectVisuals project={project} />
 <ResearchProjectDetails project={project} />
 </article>;
}
