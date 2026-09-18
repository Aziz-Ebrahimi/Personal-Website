'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { CardPageConfig } from '@/types/page';

export default function ResearchOverviewPage({ config }: { config: CardPageConfig }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <header className="mb-14 max-w-4xl">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-accent">
                    Research program
                </p>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                    {config.title}
                </h1>
                {config.description && (
                    <div className="max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                        <ReactMarkdown>{config.description}</ReactMarkdown>
                    </div>
                )}
            </header>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {config.items.map((item, index) => (
                    <motion.article
                        key={item.title}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 * index }}
                        className={`grid gap-7 py-11 first:pt-0 sm:gap-9 ${
                            item.image ? 'md:grid-cols-[minmax(260px,0.92fr)_minmax(0,1.28fr)] md:items-center' : ''
                        }`}
                    >
                        {item.image && (
                            <div
                                className="relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <Image
                                    src={item.image}
                                    alt={`${item.title} research visual`}
                                    fill
                                    className="object-contain p-3"
                                    sizes="(max-width: 768px) 100vw, 420px"
                                />
                            </div>
                        )}

                        <div className={item.image ? '' : 'max-w-4xl border-l-4 border-accent/50 pl-6 sm:pl-8'}>
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-accent">
                                {item.category || item.tags?.[0] || item.subtitle}
                            </p>
                            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                                <span className="text-primary">
                                    {item.title}
                                </span>
                            </h2>
                            {item.subtitle && (
                                <p className="mt-2 text-base font-semibold text-neutral-500 dark:text-neutral-500">
                                    {item.subtitle}
                                </p>
                            )}
                            {item.content && (
                                <div className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 dark:text-neutral-400 sm:text-lg">
                                    <ReactMarkdown>{item.content}</ReactMarkdown>
                                </div>
                            )}
                            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold">
                                {item.link && (
                                    <span role="link" aria-disabled="true" className="cursor-default text-accent" title="Project details coming soon">
                                        Project details <span aria-hidden="true">→</span>
                                    </span>
                                )}
                                {item.tags?.[0] && (
                                    <Link
                                        href={`/publications?category=${encodeURIComponent(item.tags[0])}`}
                                        className="text-neutral-500 hover:text-accent hover:underline"
                                    >
                                        Related publications
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </motion.div>
    );
}
