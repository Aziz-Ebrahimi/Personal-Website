import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageConfig } from '@/lib/content';
import type { ResearchProjectConfig } from '@/types/researchProject';
import FlightExperience from '@/components/research/FlightExperience';
export const metadata = { title: 'Remote Sensing — Forest Survey', description: 'Explore an illustrative drone survey over a simulated forest plot.' };
export default function ForestFlightPage() {
    const project = getPageConfig<ResearchProjectConfig>('research-projects/phenomics-remote-sensing');
    if (!project?.flight) notFound();
    return <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        <Link href="/research" className="text-sm font-bold text-accent hover:underline">← Back to Research</Link>
        <header className="mb-6 mt-5 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Remote sensing</p><h1 className="text-3xl font-bold text-primary sm:text-4xl">A flight over the forest</h1></div>
            <p className="max-w-lg text-sm leading-6 text-neutral-600">Explore the full survey. Choose Free orbit to drag, pan, or zoom; use Drone follow to travel with the aircraft. On touchscreens, drag to orbit and use two fingers to pan or zoom.</p>
        </header>
        <FlightExperience assets={project.flight} />
        <p className="mt-4 text-sm leading-6 text-neutral-600">This is a simulated plot inspired by an aerial image, not a georeferenced reconstruction. Tree positions, terrain, flight duration, and coverage are illustrative. No measured sensor outputs are shown.</p>
    </main>;
}
