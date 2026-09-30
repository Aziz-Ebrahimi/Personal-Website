'use client';

import { useState } from 'react';
import Image from 'next/image';
import { assetPath } from '@/lib/assetPath';
import { AnimatePresence, motion } from 'framer-motion';
import { AcademicCapIcon, EnvelopeIcon, LinkIcon, MapPinIcon } from '@heroicons/react/24/outline';
import type { SiteConfig } from '@/lib/config';
import { useMessages } from '@/lib/i18n/useMessages';

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
}

export default function Profile({ author, social, researchInterests }: ProfileProps) {
    const messages = useMessages();
    const [activeDetail, setActiveDetail] = useState<'email' | 'address' | null>(null);

    const profileLinks = [
        social.google_scholar && { label: 'Google Scholar', href: social.google_scholar, icon: AcademicCapIcon },
        social.orcid && { label: 'ORCID', href: social.orcid, icon: LinkIcon },
        social.linkedin && { label: 'LinkedIn', href: social.linkedin, icon: LinkIcon },
        social.researchgate && { label: 'ResearchGate', href: social.researchgate, icon: LinkIcon },
    ].filter(Boolean) as Array<{ label: string; href: string; icon: typeof LinkIcon }>;

    return (
        <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-base lg:sticky lg:top-28"
        >
            <div
                className="relative mx-auto mb-6 aspect-[4/5] w-full max-w-[220px] overflow-hidden border-2 border-black bg-white dark:border-white dark:bg-neutral-900"
            >
                <Image
                    src={assetPath(author.avatar)}
                    alt={`${author.name} headshot`}
                    fill
                    priority
                    sizes="220px"
                    className="object-cover object-[70%_center]"
                />
            </div>

            <div className="mb-6 text-center lg:text-left">
                <h1 className="mb-2 text-2xl font-bold leading-tight tracking-tight text-primary">
                    {author.name}
                </h1>
                <p className="mb-1 text-sm font-bold leading-5 text-accent">
                    {author.title}
                </p>
                <p className="text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                    {author.institution}
                </p>
            </div>

            <div className="space-y-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
                {social.email && (
                    <div
                        className="relative"
                        onMouseEnter={() => setActiveDetail('email')}
                        onMouseLeave={() => setActiveDetail(null)}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveDetail(activeDetail === 'email' ? null : 'email')}
                            onFocus={() => setActiveDetail('email')}
                            className="group flex min-h-8 w-full items-center gap-3 px-1 py-1 text-left"
                            aria-expanded={activeDetail === 'email'}
                            aria-controls="profile-email-detail"
                        >
                            <EnvelopeIcon className="h-5 w-5 flex-none text-neutral-500 transition-colors group-hover:text-accent" />
                            <span className="text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                                {messages.profile.email}
                            </span>
                        </button>
                        <AnimatePresence>
                            {activeDetail === 'email' && (
                                <motion.div
                                    id="profile-email-detail"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute left-0 top-full z-30 mt-2 w-[min(440px,calc(100vw-2rem))] rounded-lg border border-neutral-200 bg-background p-5 shadow-xl lg:left-full lg:top-0 lg:ml-4 lg:mt-0 dark:border-neutral-700"
                                >
                                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Email</p>
                                    <a href={`mailto:${social.email}`} className="break-all text-sm leading-5 text-primary hover:text-accent hover:underline">
                                        {social.email}
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {(social.location || social.location_details) && (
                    <div
                        className="relative"
                        onMouseEnter={() => setActiveDetail('address')}
                        onMouseLeave={() => setActiveDetail(null)}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveDetail(activeDetail === 'address' ? null : 'address')}
                            onFocus={() => setActiveDetail('address')}
                            className="group flex min-h-8 w-full items-center gap-3 px-1 py-1 text-left"
                            aria-expanded={activeDetail === 'address'}
                            aria-controls="profile-address-detail"
                        >
                            <MapPinIcon className="h-5 w-5 flex-none text-neutral-500 transition-colors group-hover:text-accent" />
                            <span className="text-sm font-semibold text-primary transition-colors group-hover:text-accent">Work address</span>
                        </button>
                        <AnimatePresence>
                            {activeDetail === 'address' && (
                                <motion.div
                                    id="profile-address-detail"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute left-0 top-full z-30 mt-2 w-[min(440px,calc(100vw-2rem))] rounded-lg border border-neutral-200 bg-background p-5 shadow-xl lg:left-full lg:top-0 lg:ml-4 lg:mt-0 dark:border-neutral-700"
                                >
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Work address</p>
                                    <div className="text-[15px] leading-6 text-primary">
                                        {social.location_details?.length
                                            ? social.location_details.map((line, index) => <p key={index}>{line}</p>)
                                            : <p>{social.location}</p>}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
                {profileLinks.map(({ label, href, icon: Icon }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-8 items-center gap-3 px-1 py-1 text-left"
                    >
                        <Icon className="h-5 w-5 flex-none text-neutral-500 transition-colors group-hover:text-accent" />
                        <span className="text-sm font-semibold text-primary transition-colors group-hover:text-accent">{label}</span>
                    </a>
                ))}
            </div>

            {researchInterests && researchInterests.length > 0 && (
                <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
                    <h2 className="mb-3 text-sm font-bold text-primary">{messages.profile.researchInterests}</h2>
                    <ul className="space-y-2 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                        {researchInterests.map((interest) => <li key={interest}>{interest}</li>)}
                    </ul>
                </div>
            )}
        </motion.aside>
    );
}
