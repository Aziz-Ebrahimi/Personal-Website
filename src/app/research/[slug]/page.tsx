import { assetPath } from '@/lib/assetPath';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageConfig } from '@/lib/content';
import { CardPageConfig } from '@/types/page';
import { ResearchProjectConfig } from '@/types/researchProject';
import ResearchProjectPage from '@/components/pages/ResearchProjectPage';

function getProject(slug: string): ResearchProjectConfig | null {
    return getPageConfig<ResearchProjectConfig>(`research-projects/${slug === 'ai-for-forest' ? 'phenomics-remote-sensing' : slug}`);
}

export function generateStaticParams() {
    const research = getPageConfig<CardPageConfig>('research');
    return [...(research?.items || []), { link: "/research/ai-for-forest" }]
        .map(item => item.link?.split('/').filter(Boolean).pop())
        .filter((slug): slug is string => Boolean(slug))
        .map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) return {};
    return { title: project.title, description: project.summary, ...(slug === 'ai-for-forest' ? { alternates: { canonical: assetPath('/research/phenomics-remote-sensing/') } } : {}) };
}

export default async function ResearchProjectRoute({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();
    return <ResearchProjectPage project={project} />;
}
