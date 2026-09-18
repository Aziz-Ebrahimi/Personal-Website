'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ResearchProjectConfig } from '@/types/researchProject';

export default function ResearchProjectPage({ project }: { project: ResearchProjectConfig }) {
    const publicationUrl = `/publications?category=${encodeURIComponent(project.related_publications_category)}`;

    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
            <nav className="mb-10 text-sm" aria-label="Breadcrumb">
                <Link href="/research" className="font-bold text-accent hover:underline">Research</Link>
                <span className="mx-2 text-neutral-400" aria-hidden="true">/</span>
                <span className="text-neutral-500">{project.category}</span>
            </nav>

            <header className="mb-12 max-w-5xl">
                <div className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-accent">
                    {project.category}
                </div>
                <h1 className="mb-4 text-4xl font-bold leading-[1.08] tracking-tight text-primary sm:text-6xl">{project.title}</h1>
                {project.subtitle && <p className="text-xl leading-8 text-neutral-500 sm:text-2xl">{project.subtitle}</p>}
            </header>

            <section className="mb-10 max-w-4xl">
                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">Project Description</h2>
                <div className="text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                    <ReactMarkdown>{project.summary}</ReactMarkdown>
                </div>
            </section>

            {project.image && (
                <div className="relative mb-14 aspect-[16/8] w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-900">
                    <Image src={project.image} alt={`${project.title} project visual`} fill className="object-contain p-5" sizes="(max-width: 1200px) 100vw, 1152px" priority />
                </div>
            )}

            <div className="max-w-4xl space-y-11">
                {project.sections.map((section, index) => (
                    <motion.section key={section.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 * index }}>
                        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-primary">{section.title}</h2>
                        <div className="text-lg leading-8 text-neutral-600 dark:text-neutral-400 [&_p]:mb-4 [&_strong]:font-bold [&_strong]:text-primary [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-7">
                            <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                    </motion.section>
                ))}
            </div>

            <aside className="mt-14 flex max-w-4xl flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
                <div>
                    <h2 className="text-xl font-bold text-primary">Related research outputs</h2>
                    <p className="mt-1 text-base text-neutral-500">See publications connected to this project area.</p>
                </div>
                <Link href={publicationUrl} className="inline-flex flex-none items-center text-base font-bold text-accent hover:underline">
                    Related Publications
                    <span aria-hidden="true" className="ml-2">→</span>
                </Link>
            </aside>
        </motion.article>
    );
}
