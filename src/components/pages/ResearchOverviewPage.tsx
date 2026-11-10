'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { CardPageConfig } from '@/types/page';
import type { ResearchProjectConfig } from '@/types/researchProject';
import FlightExperience from '@/components/research/FlightExperience';
import ResearchProjectDetails from './ResearchProjectDetails';

export default function ResearchOverviewPage({ config, projects = {} }: { config: CardPageConfig; projects?: Record<string, ResearchProjectConfig> }) {
    const featured = config.items.find(item => item.featured);
    const featuredProject = featured?.link ? projects[featured.link] : undefined;
    const items = config.items.filter(item => !item.featured);
    const [selected, setSelected] = useState(0);
    const item = items[selected] || items[0];
    const project = item?.link ? projects[item.link] : undefined;
    return <div>
        <header className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Research program</p>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-primary sm:text-5xl">{config.title}</h1>
            <div className="text-lg leading-8 text-neutral-600 dark:text-neutral-600"><ReactMarkdown>{config.description || ''}</ReactMarkdown></div>
        </header>
        {featuredProject && <section aria-label="Featured Remote Sensing research" className="mb-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-accent">Featured research</p>
            {featuredProject.flight && <FlightExperience assets={featuredProject.flight} preview />}
            <div className="mt-8 rounded-xl border border-neutral-200 p-5 sm:p-8">
                <ResearchProjectDetails project={featuredProject} embedded />
            </div>
        </section>}
        <h2 className="mb-6 text-2xl font-bold text-primary">Other research areas</h2>
        <div className="grid items-start gap-7 lg:grid-cols-[230px_minmax(0,1fr)]">
            <div className="grid gap-2 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1" role="tablist" aria-label="Research areas" aria-orientation="vertical">
                {items.map((entry, index) => <button key={entry.link || entry.title} id={`research-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls="research-panel" tabIndex={selected === index ? 0 : -1}
                    onClick={() => setSelected(index)} onKeyDown={event => {
                        const step = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
                        if (!step && event.key !== 'Home' && event.key !== 'End') return;
                        event.preventDefault();
                        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (selected + step + items.length) % items.length;
                        setSelected(next); document.getElementById(`research-tab-${next}`)?.focus();
                    }}
                    className={`rounded-lg border border-l-[3px] px-4 py-4 text-left text-sm [overflow-wrap:anywhere] font-bold leading-6 transition-colors ${selected === index ? 'border-accent/30 border-l-accent bg-accent/10 text-primary' : 'border-neutral-200 bg-background text-neutral-600 hover:border-accent/50 dark:border-neutral-800 dark:text-neutral-600'}`}>
                    <span className="mb-1 block text-[10px] font-normal uppercase tracking-[0.14em] text-accent">Research area 0{index + 1}</span>
                    {entry.subtitle || entry.tags?.[0] || entry.title}
                </button>)}
            </div>
            {item && <section id="research-panel" role="tabpanel" aria-labelledby={`research-tab-${selected}`} tabIndex={0} className="min-w-0 rounded-xl border border-neutral-200 bg-background p-5 shadow-sm sm:p-8 dark:border-neutral-800">
                {project ? <ResearchProjectDetails project={project} embedded /> : <><h2 className="mb-4 text-3xl font-bold">{item.title}</h2><ReactMarkdown>{item.content || ''}</ReactMarkdown></>}
                {project && item.link && <Link href={item.link} className="mt-6 inline-block text-sm font-bold text-accent hover:underline">Project permalink <span aria-hidden="true">↗</span></Link>}
            </section>}
        </div>
    </div>;
}
