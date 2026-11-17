import { ArrowRight, BookOpen, ChartNoAxesCombined, Dna, Leaf, MessagesSquare, Microscope, ScanLine, Sprout, Target, Trees, Users } from 'lucide-react';
import type { CardPageConfig } from '@/types/page';

const topics = [
    { icon: Dna, title: 'Diversity & adaptation', detail: 'How trees respond to change' },
    { icon: ChartNoAxesCombined, title: 'Heritability & genetic gain', detail: 'Understanding inherited traits' },
    { icon: Trees, title: 'Provenance & progeny', detail: 'Finding the right trees for a site' },
    { icon: Sprout, title: 'Tree improvement', detail: 'Breeding and seed orchards' },
    { icon: Microscope, title: 'Markers & genomics', detail: 'SNPs, GWAS and genomic selection' },
    { icon: Leaf, title: 'Conservation genomics', detail: 'Protecting genetic diversity' },
    { icon: ScanLine, title: 'High-throughput phenotyping', detail: 'Measuring traits at scale' },
];
const activities = [
    { icon: MessagesSquare, title: 'Discuss', detail: 'Think, pair and share' },
    { icon: BookOpen, title: 'Explore', detail: 'Real examples and literature' },
    { icon: Users, title: 'Collaborate', detail: 'Learn through teamwork' },
    { icon: Target, title: 'Solve', detail: 'Build a project around a forestry problem' },
];

export default function TeachingPage({ config }: { config: CardPageConfig }) {
    return (
        <div>
            <h1 className="mb-6 text-4xl font-bold font-serif text-primary">{config.title}</h1>
            {config.items.map(course => (
                <article key={course.title} className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <header className="bg-emerald-950 px-6 py-8 text-white sm:p-10">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-200">{course.date} · University of Georgia</p>
                        <h2 className="max-w-xl text-3xl font-bold font-serif sm:text-4xl">{course.title}</h2>
                        <p className="mt-3 text-sm text-emerald-100">{course.subtitle}</p>
                        <p className="mt-5 max-w-2xl leading-relaxed text-emerald-50">{course.content}</p>
                        <div className="mt-6 flex flex-wrap gap-2">{course.tags?.map(tag => <span key={tag} className="rounded-full border border-emerald-700 px-3 py-1 text-xs text-emerald-100">{tag}</span>)}</div>
                        <div aria-label="From genes to better trees to healthier forests" className="mt-8 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 border-t border-emerald-800 pt-7 text-center">
                            {[{ icon: Dna, label: 'Genes' }, { icon: Sprout, label: 'Better trees' }, { icon: Trees, label: 'Healthier forests' }].map(({ icon: Icon, label }, i) => (
                                <div key={label} className="contents">
                                    {i > 0 && <ArrowRight aria-hidden="true" className="h-5 w-5 text-emerald-400" />}
                                    <div><Icon aria-hidden="true" className="mx-auto mb-2 h-12 w-12 text-emerald-300" strokeWidth={1.3} /><p className="text-sm font-semibold">{label}</p></div>
                                </div>
                            ))}
                        </div>
                    </header>
                    <div className="space-y-8 bg-white p-6 sm:p-8 dark:bg-neutral-900">
                        <section aria-labelledby="course-topics">
                            <h3 id="course-topics" className="mb-4 text-xl font-semibold text-primary">What you’ll explore</h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {topics.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-center gap-4 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40"><Icon aria-hidden="true" className="h-9 w-9 shrink-0 text-emerald-700 dark:text-emerald-400" strokeWidth={1.5} /><div><h4 className="text-sm font-semibold text-primary">{title}</h4><p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{detail}</p></div></div>)}
                            </div>
                        </section>
                        <section aria-labelledby="course-learning">
                            <h3 id="course-learning" className="mb-4 text-xl font-semibold text-primary">Learn by doing</h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {activities.map(({ icon: Icon, title, detail }) => <div key={title} className="rounded-xl border border-neutral-200 p-4 text-center dark:border-neutral-700"><Icon aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-emerald-700 dark:text-emerald-400" strokeWidth={1.5} /><h4 className="font-semibold text-primary">{title}</h4><p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{detail}</p></div>)}
                            </div>
                        </section>
                        <footer className="border-t border-neutral-200 pt-6 text-sm dark:border-neutral-700">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div><p className="font-semibold text-primary">Undergraduate</p><p className="mt-1 text-neutral-600 dark:text-neutral-400">FORS 5950 FG · CRN 77301</p></div>
                                <div><p className="font-semibold text-primary">Graduate</p><p className="mt-1 text-neutral-600 dark:text-neutral-400">FORS 8950 FG · CRN 77302</p></div>
                            </div>
                            <p className="mt-5 text-neutral-600 dark:text-neutral-400">Instructor: Aziz Ebrahimi, Ph.D. · Warnell School of Forestry and Natural Resources</p>
                            <a className="mt-2 inline-block font-medium text-accent hover:underline" href="mailto:aebrahimi@uga.edu">aebrahimi@uga.edu</a>
                        </footer>
                    </div>
                </article>
            ))}
        </div>
    );
}
