'use client';

import { useId, useState } from 'react';
import type { FlightAssets, ResearchWorkflowContent, WorkflowStepId } from '@/types/researchProject';
import WorkflowFigure from './WorkflowFigure';
import RemoteSensingPanel from './RemoteSensingPanel';

export default function ResearchWorkflow({ content, flight }: { content: ResearchWorkflowContent; flight?: FlightAssets }) {
    const [selected, setSelected] = useState<WorkflowStepId>('sensing');
    const uid = useId().replace(/:/g, '');
    const step = content.steps.find(entry => entry.id === selected) || content.steps[0];
    if (!step) return null;
    const featureActive = selected !== 'dl';
    const imageActive = ['sensing', 'dl', 'applications'].includes(selected);
    const genomicActive = ['gwas', 'selection'].includes(selected);
    const button = (id: WorkflowStepId) => {
        const entry = content.steps.find(item => item.id === id);
        if (!entry) return null;
        return <button type="button" aria-pressed={selected === id} aria-controls={`${uid}-detail`} onClick={() => setSelected(id)} className={`w-full rounded-lg border px-3 py-3 text-left text-sm font-bold leading-5 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${selected === id ? 'border-accent bg-accent text-white dark:text-background' : 'border-neutral-200 bg-background text-primary hover:border-accent'}`}>{entry.label}</button>;
    };
    const arrow = (active: boolean) => <span aria-hidden="true" className={`self-center text-center text-xl ${active ? 'text-accent' : 'text-neutral-400'} rotate-90 lg:rotate-0`}>→</span>;
    return <section aria-label="Forest research workflow" className="rounded-xl border border-neutral-200 bg-background p-4 sm:p-6">
        <header className="mb-6"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">Connected approaches</p><h2 className="text-2xl font-bold text-primary">{content.title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{content.introduction}</p></header>
        <div className="grid gap-3 lg:grid-cols-[1fr_24px_1.3fr_24px_1.2fr_24px_1fr] lg:items-center">
            <div className="lg:row-span-2">{button('sensing')}<p className="mt-2 text-xs leading-5 text-neutral-600">RGB · Multispectral<br/>Hyperspectral · LiDAR</p></div>
            {arrow(featureActive)}
            <div className={`rounded-xl border p-3 ${featureActive ? 'border-accent/40 bg-accent/5' : 'border-neutral-200'}`}><p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-accent">{content.feature_path_label}</p>{button('features')}<p className="mt-2 text-xs leading-5 text-neutral-600">Measured or estimated phenotypes</p></div>
            {arrow(featureActive)}
            <div className="space-y-2">{button('ml')}{button('gwas')}{button('selection')}</div>
            <div className="hidden lg:block">{arrow(featureActive)}</div>
            <div className="order-last lg:order-none lg:row-span-2">{button('applications')}<p className="mt-2 text-xs leading-5 text-neutral-600">Condition assessment<br/>Growth prediction<br/>Breeding decisions</p></div>
            <div className="hidden lg:col-start-2 lg:row-start-2 lg:block">{arrow(imageActive)}</div>
            <div className={`rounded-xl border p-3 lg:col-span-3 lg:col-start-3 lg:row-start-2 ${imageActive ? 'border-accent/40 bg-accent/5' : 'border-neutral-200'}`}>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-accent">{content.image_path_label}</p>
                <div className="grid items-center gap-2 sm:grid-cols-[1fr_20px_1fr_20px_1fr]"><span className="text-xs leading-5 text-primary">Remote-sensing imagery</span><span aria-hidden="true" className={`rotate-90 text-center sm:rotate-0 ${imageActive ? 'text-accent' : 'text-neutral-400'}`}>→</span>{button('dl')}<span aria-hidden="true" className={`rotate-90 text-center sm:rotate-0 ${imageActive ? 'text-accent' : 'text-neutral-400'}`}>→</span><span className="text-xs leading-5 text-primary">Predicted traits</span></div>
            </div>
            <div className="hidden lg:col-start-6 lg:row-start-2 lg:block">{arrow(imageActive)}</div>
        </div>
        <div className={`mt-4 rounded-lg border border-dashed px-4 py-3 ${genomicActive ? 'border-accent bg-accent/10' : 'border-neutral-300'}`}>
            <p className="text-sm font-bold text-primary">{content.genomic_input_label} <span className="text-accent">→ GWAS + Genomic selection</span></p><p className="mt-1 text-xs leading-5 text-neutral-600">{content.genomic_input_description}</p>
        </div>
        <div id={`${uid}-detail`} role="region" aria-label={`${step.label} details`} className={`mt-6 grid items-center gap-6 rounded-xl bg-accent/[0.045] p-4 sm:p-6 ${['sensing', 'features', 'gwas'].includes(step.id) ? '' : 'md:grid-cols-[1.35fr_1fr]'}`}>
            {step.id === 'sensing' ? <RemoteSensingPanel flight={flight} /> : <div className="min-w-0"><div className="overflow-x-auto rounded-lg" tabIndex={0} aria-label="Detail figure; scroll horizontally on small screens"><div className={step.id === 'features' ? 'min-w-[640px]' : step.id === 'gwas' ? 'min-w-[680px]' : 'min-w-[440px] sm:min-w-0'}><WorkflowFigure stage={step.id} label={step.label} /></div></div><p className="mt-2 text-xs text-neutral-600 sm:hidden">Swipe the figure to explore →</p><p className="mt-2 text-center text-[11px] text-neutral-500">Illustrative schematic · not measured research results</p></div>}
            <div aria-live="polite"><h3 className="text-xl font-bold text-primary">{step.label}</h3><p className="mt-3 text-sm leading-7 text-neutral-600">{step.description}</p><p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-6 text-primary">{step.application}</p></div>
        </div>
    </section>;
}
