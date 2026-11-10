'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Publication } from '@/types/publication';
import type { PublicationPageConfig } from '@/types/page';
import type { SiteConfig } from '@/lib/config';
import FormattedBibTeXText from './FormattedBibTeXText';
import EmbeddedPublicationsList from './EmbeddedPublicationsList';

const categories = ['Forest Genetics/Genomics', 'Conservation Genomics', 'Phenomics/Remote Sensing', 'Bioinformatics/Machine Learning'];
const chip = 'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors';
const inactive = 'border-neutral-200 text-neutral-600 hover:border-accent dark:border-neutral-200 dark:text-neutral-600';
const active = 'border-accent bg-accent text-white dark:text-background';

function PaperDetails({ paper }: { paper: Publication }) {
    const [copied, setCopied] = useState('');
    return <article className="min-w-0 p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-accent"><span>{paper.year}</span><span>·</span><span>{paper.type.replaceAll('-', ' ')}</span></div>
        <h2 className="text-2xl font-bold leading-snug tracking-tight text-primary"><FormattedBibTeXText nodes={paper.titleNodes} fallback={paper.title} /></h2>
        <p className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-600">{paper.authors.map((author, index) => <span key={index}><span className={`${author.isHighlighted ? 'font-bold text-primary' : ''} ${author.isCoAuthor ? 'underline underline-offset-4' : ''}`}>{author.name}</span>{author.isCorresponding && <sup>†</sup>}{index < paper.authors.length - 1 && ', '}</span>)}</p>
        <p className="mt-3 text-sm font-bold leading-6 text-primary">{paper.journal || paper.conference} · {paper.year}</p>
        {paper.doi && <p className="mt-2 break-all font-mono text-xs text-neutral-500">doi: {paper.doi}</p>}
        <div className="my-6 flex flex-wrap gap-2">{paper.tags.map(tag => <span key={tag} className="rounded bg-accent/10 px-2 py-1 text-xs text-accent">{tag}</span>)}</div>
        {(paper.abstract || paper.description) && <section className="border-t border-neutral-200 pt-6 dark:border-neutral-200"><h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-accent">{paper.abstract ? 'Abstract' : 'Overview'}</h3><p className="whitespace-pre-line text-base leading-8 text-neutral-600 dark:text-neutral-600">{paper.abstract || paper.description}</p></section>}
        <div className="mt-7 flex flex-wrap gap-3">
            {(paper.doi || paper.url) && <a className={`${chip} ${active}`} href={paper.doi ? `https://doi.org/${paper.doi}` : paper.url} target="_blank" rel="noopener noreferrer">Read article ↗</a>}
            {paper.code && <a className={`${chip} ${inactive}`} href={paper.code} target="_blank" rel="noopener noreferrer">Code ↗</a>}
        </div>
        {paper.bibtex && <details className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-200"><summary className="cursor-pointer text-sm font-bold text-accent">BibTeX citation</summary><pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-background p-4 text-xs leading-6">{paper.bibtex}</pre><button className={`${chip} ${inactive} mt-3`} onClick={async () => { try { await navigator.clipboard.writeText(paper.bibtex || ''); setCopied('Citation copied'); } catch { setCopied('Unable to copy. Select the citation text to copy manually.'); } }}>Copy citation</button><p role="status" className="mt-2 text-xs text-neutral-500">{copied}</p></details>}
    </article>;
}

export default function PublicationsList({ config, publications, embedded = false, profiles }: { config: PublicationPageConfig; publications: Publication[]; embedded?: boolean; profiles?: SiteConfig['social'] }) {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [year, setYear] = useState('all');
    const [type, setType] = useState('all');
    const [filters, setFilters] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    useEffect(() => { const requested = new URLSearchParams(window.location.search).get('category'); if (requested && categories.includes(requested)) setCategory(requested); }, []);
    const results = useMemo(() => publications.filter(paper => {
        const searchText = [paper.title, ...paper.authors.map(a => a.name), paper.journal, paper.conference, paper.year].join(' ').toLowerCase();
        return searchText.includes(query.trim().toLowerCase()) && (category === 'all' || paper.tags.includes(category)) && (year === 'all' || String(paper.year) === year) && (type === 'all' || paper.type === type);
    }).sort((a, b) => b.year - a.year), [publications, query, category, year, type]);
    const selected = results.find(paper => paper.id === selectedId) || results[0];
    useEffect(() => { setSelectedId(selected?.id || null); }, [selected?.id]);
    const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
    const types = [...new Set(publications.map(p => p.type))].sort();
    if (embedded) return <EmbeddedPublicationsList config={config} publications={publications} embedded />;
    return <div>
        <header className="mb-7"><h1 className="mb-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl">{config.title}</h1><p className="max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-600">{config.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">{profiles?.orcid && <a className={`${chip} ${inactive}`} href={profiles.orcid} target="_blank" rel="noopener noreferrer">ORCID ↗</a>}{profiles?.google_scholar && <a className={`${chip} ${inactive}`} href={profiles.google_scholar} target="_blank" rel="noopener noreferrer">Google Scholar ↗</a>}</div>
        </header>
        <section aria-label="Search and filter publications" className="mb-8 rounded-xl border border-neutral-200 bg-accent/[0.035] p-5 sm:p-6 dark:border-neutral-800">
            <label htmlFor="publication-search" className="mb-3 block text-xs font-bold uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-600">Search title, author, journal, or year</label>
            <input id="publication-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try “butternut”, “genomics”, or a year" className="w-full rounded-lg border border-neutral-200 bg-background px-4 py-3.5 text-base dark:border-neutral-200" />
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Publication categories">{['all', ...categories].map(value => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)} className={`${chip} ${category === value ? active : inactive}`}>{value === 'all' ? 'All' : value}</button>)}</div>
            <button className="mt-4 text-sm font-bold text-accent" aria-expanded={filters} aria-controls="publication-filters" onClick={() => setFilters(!filters)}>Year & type filters {filters ? '−' : '+'}</button>
            {filters && <div id="publication-filters" className="mt-4 flex flex-wrap gap-4"><label className="text-sm">Year<select aria-label="Year" value={year} onChange={event => setYear(event.target.value)} className="ml-3 rounded border border-neutral-200 bg-background p-2 dark:border-neutral-200"><option value="all">All years</option>{years.map(value => <option key={value}>{value}</option>)}</select></label><label className="text-sm">Type<select aria-label="Type" value={type} onChange={event => setType(event.target.value)} className="ml-3 rounded border border-neutral-200 bg-background p-2 dark:border-neutral-200"><option value="all">All types</option>{types.map(value => <option key={value} value={value}>{value.replaceAll('-', ' ')}</option>)}</select></label></div>}
        </section>
        <div className="mb-4 flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-500"><span role="status">{results.length} {results.length === 1 ? 'publication' : 'publications'}</span><span>Newest first</span></div>
        {!selected ? <div className="rounded-xl border border-neutral-200 p-10 text-center dark:border-neutral-800"><p>No publications match these filters.</p><button className="mt-4 font-bold text-accent" onClick={() => { setQuery(''); setCategory('all'); setYear('all'); setType('all'); }}>Clear filters</button></div> : <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800"><ul className="divide-y divide-neutral-200 dark:divide-neutral-800">{results.map(paper => <li key={paper.id}>
                <button aria-expanded={selected.id === paper.id} aria-controls={selected.id === paper.id ? `paper-detail-${paper.id} paper-desktop-detail` : undefined} onClick={() => setSelectedId(paper.id)} className={`w-full border-l-[3px] px-5 py-5 text-left transition-colors ${selected.id === paper.id ? 'border-accent bg-accent/[0.08]' : 'border-transparent hover:bg-accent/[0.035]'}`}><span className="mb-2 block text-xs font-bold text-accent">{paper.year}</span><span className="block text-base font-bold leading-6 text-primary"><FormattedBibTeXText nodes={paper.titleNodes} fallback={paper.title} /></span><span className="mt-2 block text-sm leading-6 text-neutral-500">{paper.journal || paper.conference}</span><span className="mt-3 flex flex-wrap gap-2">{paper.tags.map(tag => <span key={tag} className="text-[11px] text-accent">{tag}</span>)}</span></button>
                {selected.id === paper.id && <div id={`paper-detail-${paper.id}`} className="border-t border-accent/20 bg-accent/[0.035] lg:hidden"><PaperDetails key={paper.id} paper={paper} /></div>}
            </li>)}</ul></div>
            <div id="paper-desktop-detail" className="sticky top-28 hidden min-w-0 rounded-xl border border-neutral-200 border-t-[3px] border-t-accent bg-accent/[0.035] shadow-sm lg:block dark:border-neutral-800 dark:border-t-accent"><PaperDetails key={selected.id} paper={selected} /></div>
        </div>}
    </div>;
}
