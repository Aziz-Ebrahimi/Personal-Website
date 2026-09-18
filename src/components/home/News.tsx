'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="mb-5 text-[28px] font-bold tracking-tight text-primary">{resolvedTitle}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        {item.date && <span className="mt-1 w-20 flex-shrink-0 text-sm text-neutral-500">{item.date}</span>}
                        <p className="text-base leading-6 text-neutral-700 dark:text-neutral-300">{item.content}</p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
