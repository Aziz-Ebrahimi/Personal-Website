'use client';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { assetPath } from '@/lib/assetPath';
import type { ResearchProjectConfig } from '@/types/researchProject';

export default function ResearchProjectDetails({ project, embedded = false }: { project: ResearchProjectConfig; embedded?: boolean }) {
 const categories = project.related_publications_categories ?? (project.related_publications_category ? [project.related_publications_category] : []);
 const Title = embedded ? 'h2' : 'h1';
 return <div>
            {project.workflow && !embedded && <h1 className="sr-only">{project.title}</h1>}
            {!project.workflow && <>
            <header className="mb-12 max-w-5xl">
                <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-accent">
                    {project.category}
                </div>
                <Title className="mb-4 text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-4xl">{project.title}</Title>
                {project.subtitle && <p className="text-xl leading-8 text-neutral-500 sm:text-2xl">{project.subtitle}</p>}
            </header>

            <section className="mb-10 max-w-4xl">
                <h2 className="mb-5 text-xl font-semibold tracking-tight text-primary sm:text-2xl">Project Description</h2>
                <div className="text-lg leading-8 text-neutral-600 dark:text-neutral-600">
                    <ReactMarkdown>{project.summary}</ReactMarkdown>
                </div>
            </section>

            {project.image && (
                <div className="relative mb-14 aspect-[16/8] w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-900">
                    <Image src={assetPath(project.image)} alt={`${project.title} project visual`} fill className="object-contain p-5" sizes="(max-width: 1200px) 100vw, 1152px" priority />
                </div>
            )}

            <div className="max-w-4xl space-y-11">
                {project.sections.map((section) => (
                    <section key={section.title}>
                        <h2 className="mb-4 text-xl font-semibold tracking-tight text-primary">{section.title}</h2>
                        <div className="text-lg leading-8 text-neutral-600 dark:text-neutral-600 [&_p]:mb-4 [&_strong]:font-bold [&_strong]:text-primary [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-7">
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                    </section>
                ))}
            </div>

            </>}

            <aside className={`${project.workflow ? 'mt-0' : 'mt-14'} flex max-w-4xl flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800`}>
                <div>
                    <h2 className="text-xl font-bold text-primary">Related research outputs</h2>
                    <p className="mt-1 text-base text-neutral-500">See publications connected to this project area.</p>
                </div>
                <div className="flex flex-wrap gap-3">{categories.map(category => <Link key={category} href={`/publications?category=${encodeURIComponent(category)}`} className="inline-flex flex-none items-center text-base font-bold text-accent hover:underline">
                    {categories.length > 1 ? category : 'Related Publications'}
                    <span aria-hidden="true" className="ml-2">→</span>
                </Link>)}</div>
            </aside>
</div>;
}
