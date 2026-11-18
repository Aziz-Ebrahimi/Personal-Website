import { ArrowRight, Dna, Sprout, Trees } from 'lucide-react';
import type { CardPageConfig } from '@/types/page';

export default function TeachingPage({ config }: { config: CardPageConfig }) {
    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold font-serif text-primary">{config.title}</h1>
            {config.items.map(course => (
                <article key={course.title} className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <header className="bg-emerald-950 px-5 py-6 text-white sm:p-7">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-200">{course.date} · University of Georgia</p>
                        <h2 className="max-w-xl text-3xl font-bold font-serif sm:text-4xl">{course.title}</h2>
                        <p className="mt-3 text-sm text-emerald-100">{course.subtitle}</p>
                        <p className="mt-5 max-w-2xl leading-relaxed text-emerald-50">{course.content}</p>
                        {course.description && <p className="mt-4 max-w-2xl leading-relaxed text-emerald-100">{course.description}</p>}
                        <div className="mt-6 flex flex-wrap gap-2">{course.tags?.map(tag => <span key={tag} className="rounded-full border border-emerald-700 px-3 py-1 text-xs text-emerald-100">{tag}</span>)}</div>
                        <div aria-label="From genes to better trees to healthier forests" className="mt-6 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 border-t border-emerald-800 pt-5 text-center">
                            {[{ icon: Dna, label: 'Genes' }, { icon: Sprout, label: 'Better trees' }, { icon: Trees, label: 'Healthier forests' }].map(({ icon: Icon, label }, i) => (
                                <div key={label} className="contents">
                                    {i > 0 && <ArrowRight aria-hidden="true" className="h-5 w-5 text-emerald-400" />}
                                    <div><Icon aria-hidden="true" className="mx-auto mb-2 h-12 w-12 text-emerald-300" strokeWidth={1.3} /><p className="text-sm font-semibold">{label}</p></div>
                                </div>
                            ))}
                        </div>
                    </header>
                </article>
            ))}
        </div>
    );
}
