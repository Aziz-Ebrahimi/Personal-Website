'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[28px] font-bold tracking-tight text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="py-5"
                    >
                        <h3 className="mb-2 text-lg font-bold leading-6 text-primary">
                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                        </h3>
                        <p className="mb-1 text-base leading-6 text-neutral-700 dark:text-neutral-300">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-semibold text-primary' : ''} ${author.isCoAuthor ? 'underline decoration-neutral-400 underline-offset-4' : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className="ml-0 text-neutral-600 dark:text-neutral-400">†</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="mb-2 text-base text-neutral-600 dark:text-neutral-400">
                            {pub.journal || pub.conference} · {pub.year}
                            {pub.type === 'preprint' && <span className="ml-2 text-sm font-semibold text-accent">Preprint</span>}
                        </p>
                        {(pub.doi || pub.url) && (
                            <a
                                href={pub.doi ? `https://doi.org/${pub.doi}` : pub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-accent hover:underline"
                            >
                                {pub.doi ? 'DOI' : 'Read article'} <span aria-hidden="true">↗</span>
                            </a>
                        )}
                        {pub.description && (
                            <p className="line-clamp-2 text-base leading-6 text-neutral-500 dark:text-neutral-400">
                                {pub.description}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
