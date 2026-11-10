'use client';
import Link from 'next/link';
import FlightExperience from '@/components/research/FlightExperience';
import type { ResearchProjectConfig } from '@/types/researchProject';
import ResearchProjectDetails from './ResearchProjectDetails';
export default function ResearchProjectPage({ project }: { project: ResearchProjectConfig }) {
 return <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
 <nav className="mb-10 text-sm" aria-label="Breadcrumb"><Link href="/research" className="font-bold text-accent hover:underline">Research</Link><span className="mx-2">/</span>{project.category}</nav>
 {project.flight && <div className="mb-10"><FlightExperience assets={project.flight} preview /></div>}
 <ResearchProjectDetails project={project} />
 </article>;
}
