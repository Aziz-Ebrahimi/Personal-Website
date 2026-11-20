'use client';

import { assetPath } from '@/lib/assetPath';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { CardItem, CardPageConfig } from '@/types/page';

function MemberCard({ member, index }: { member: CardItem; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 * index }}
            className="min-w-0 rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
            <div className="relative mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-neutral-100 shadow-sm ring-1 ring-neutral-200 dark:border-neutral-900 dark:bg-neutral-800 dark:ring-neutral-700">
                {member.image && (
                    <Image
                        src={assetPath(member.image)}
                        alt={`${member.title} headshot`}
                        fill
                        className="object-cover"
                        sizes="128px"
                    />
                )}
            </div>
            <h3 className="text-base font-semibold leading-tight text-primary">{member.title}</h3>
            {member.subtitle && <p className="mt-1 text-sm font-medium leading-snug text-accent">{member.subtitle}</p>}
            {member.content && (
                <div className="mt-4 border-t border-neutral-100 pt-3 text-left text-sm leading-relaxed dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                    <ReactMarkdown>{member.content}</ReactMarkdown>
                </div>
            )}
        </motion.article>
    );
}

export default function TeamPage({ config }: { config: CardPageConfig }) {
    const principalInvestigator = config.items.find(item => item.category === 'Principal Investigator') || config.items[0];
    const members = config.items.filter(item => item !== principalInvestigator);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-5">
                <h1 className="mb-4 text-3xl font-bold font-serif text-primary">{config.title}</h1>
                {config.description && (
                    <div className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                        <ReactMarkdown>{config.description}</ReactMarkdown>
                    </div>
                )}
            </div>

            {principalInvestigator && (
                <section className="mb-7" aria-labelledby="pi-heading">
                    <h2 id="pi-heading" className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Principal Investigator</h2>
                    <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="relative h-32 w-32 flex-none overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-neutral-700">
                            {principalInvestigator.image && (
                                <Image src={assetPath(principalInvestigator.image)} alt={`${principalInvestigator.title} headshot`} fill className="object-cover object-[70%_center]" sizes="128px" />
                            )}
                        </div>
                        <div className="min-w-0 text-center sm:text-left">
                            <h3 className="text-2xl font-semibold text-primary">{principalInvestigator.title}</h3>
                            {principalInvestigator.subtitle && <p className="mt-1 font-medium text-accent">{principalInvestigator.subtitle}</p>}
                            {principalInvestigator.affiliation && <p className="mt-1 text-sm text-neutral-500">{principalInvestigator.affiliation}</p>}
                            {principalInvestigator.content && (
                                <div className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    <ReactMarkdown>{principalInvestigator.content}</ReactMarkdown>
                                </div>
                            )}
                            {principalInvestigator.tags && (
                                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                                    {principalInvestigator.tags.map(tag => <span key={tag} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{tag}</span>)}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <section aria-labelledby="members-heading">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 id="members-heading" className="text-2xl font-semibold text-primary">Members & Collaborators</h2>
                    </div>

                </div>
                <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {members.map((member, index) => <MemberCard key={`${member.title}-${index}`} member={member} index={index} />)}
                </div>
            </section>
        </motion.div>
    );
}
