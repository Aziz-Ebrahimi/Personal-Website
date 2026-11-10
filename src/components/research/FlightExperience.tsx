'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { assetPath } from '@/lib/assetPath';
import type { FlightAssets } from '@/types/researchProject';
const FlightViewer = dynamic(() => import('./FlightViewer'), { ssr: false, loading: () => <div className="absolute bottom-4 left-4 rounded bg-background/90 px-3 py-2 text-sm">Loading flight viewer…</div> });

export default function FlightExperience({ assets, preview = false }: { assets: FlightAssets; preview?: boolean }) {
    return <section aria-label="Illustrative drone survey" className="overflow-hidden rounded-xl border border-neutral-200 bg-background">
        <div className={`relative overflow-hidden bg-[#eaf1ed] ${preview ? 'mx-auto aspect-video max-h-[360px] w-full' : 'h-[65svh] min-h-[340px] sm:h-[72svh]'}`}>
            {/* The poster remains available underneath WebGL and during loading/failure. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetPath(assets.poster)} alt="Simulated forest plot with central planting rows, surrounding woodland, and a curved road" className="absolute inset-0 h-full w-full object-contain" />
            <FlightViewer assets={assets} preview={preview} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-5 py-4">
            <p className="text-xs text-neutral-600">Illustrative flight simulation · approximate terrain and trees</p>
            {preview ? <Link href={assets.viewer_url} className="text-sm font-bold text-accent hover:underline">Explore full flight <span aria-hidden="true">↗</span></Link>
                : <a href={assetPath(assets.model)} download className="text-sm font-bold text-accent hover:underline">Download 3D model (.glb) ↓</a>}
        </div>
    </section>;
}
