'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FlightAssets } from '@/types/researchProject';
import FlightExperience from './FlightExperience';
import { assetPath } from '@/lib/assetPath';

const bands = ['#b76464', '#619872', '#608db5', '#b98d66', '#9980b2'];
const spectrum = ['#8064aa','#6978b5','#5799b0','#58a48c','#8db363','#c5b65a','#d39556','#bf6e65'];

function Canopy({ tint }: { tint?: string }) {
    return <g>{Array.from({length: 36}, (_, i) => <g key={i}><circle cx={12+(i%9)*18} cy={10+Math.floor(i/9)*16} r={8+(i%3)} fill={tint || ['#427453','#6b915b','#91aa6e'][i%3]}/><circle cx={10+(i%9)*18} cy={7+Math.floor(i/9)*16} r="4" fill="#fff" opacity=".12"/></g>)}</g>;
}

export default function RemoteSensingPanel({ flight }: { flight?: FlightAssets }) {
    const uid = useId().replace(/:/g,'');
    const root = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const [active, setActive] = useState(false);
    useEffect(() => {
        const element = root.current;
        if (!element) return;
        let visible = false;
        const update = () => setActive(visible && !document.hidden);
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
        observer.observe(element);
        document.addEventListener('visibilitychange', update);
        return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
    }, []);
    const text = {fill:'var(--foreground)',fontFamily:'inherit',fontSize:12};
    const cards = [
        {name:'RGB', figure:<svg viewBox="840 30 384 159" role="img" aria-label="Overhead canopy crop from the supplied forest illustration"><image href={assetPath('/models/sensing-reference.png')} width="1290" height="840" /></svg>},
        {name:'Multispectral', figure:<svg viewBox="0 0 360 150" role="img" aria-label="Five canopy image layers representing red, green, blue, red edge and near-infrared bands">{[4,3,2,1,0].map(i=><g key={i}><g transform={`translate(${32+i*7} ${12+i*24}) skewX(-27) scale(1 .43)`}><rect width="170" height="75" fill={bands[i]}/><Canopy tint={bands[i]}/></g><text {...text} x="244" y={30+i*24}>{['Red','Green','Blue','Red edge','NIR'][i]}</text></g>)}</svg>},
        {name:'Hyperspectral', figure:<svg viewBox="0 0 360 150" role="img" aria-label="Canopy image stack and illustrative reflectance curve drawing across visible and near-infrared bands"><defs><linearGradient id={`${uid}-spectrum`}>{spectrum.map((c,i)=><stop key={c} offset={i/7} stopColor={c}/>)}</linearGradient></defs>{[7,6,5,4,3,2,1,0].map(i=><g key={i} transform={`translate(${18+i*2} ${19+i*11}) skewX(-25) scale(.73 .35)`}><rect width="170" height="75" fill={spectrum[i]}/><Canopy tint={spectrum[i]}/></g>)}<path d="M184 15V113H350" fill="none" stroke="var(--neutral-500)"/><rect x="185" y="104" width="165" height="8" fill={`url(#${uid}-spectrum)`} opacity=".45"/>{['400','600','800','1000'].map((label,i)=><g key={label}><path d={`M${186+i*41} 28V103`} stroke="var(--neutral-500)" strokeOpacity=".2" strokeDasharray="2 3"/><text {...text} fontSize="9" x={204+i*41} y="125" textAnchor="middle">{label}</text></g>)}<g className="spectral-sweep" style={{animationPlayState: active && !paused ? 'running':'paused'}}><path d="M187 88C198 65 208 87 219 73S237 60 246 78S265 90 277 57S293 29 309 35S333 44 348 29" fill="none" stroke={`url(#${uid}-spectrum)`} strokeWidth="3"/></g><text {...text} fontSize="10" x="265" y="144" textAnchor="middle">Wavelength (nm) →</text><text {...text} fontSize="10" transform="translate(174 65) rotate(-90)" textAnchor="middle">Reflectance</text></svg>},
        {name:'LiDAR', figure:<svg viewBox="812 660 477 174" role="img" aria-label="User-supplied LiDAR forest plot with height color scale"><image href={assetPath('/models/sensing-reference.png')} width="1290" height="840" /></svg>},
    ];
    return <div ref={root} className="min-w-0">
        <div className="grid items-center gap-4 xl:grid-cols-[minmax(0,1.1fr)_44px_minmax(0,1fr)] xl:gap-0">
            <div className="min-w-0"><h4 className="mb-3 text-sm font-bold text-primary">UAV observation of the forest plot</h4>{flight && <FlightExperience assets={flight} preview />}<p className="mt-3 text-xs leading-6 text-neutral-600">One sensing workflow, four complementary types of data.</p></div>
            <svg viewBox="0 0 44 640" preserveAspectRatio="none" aria-hidden="true" className="hidden h-full min-h-[640px] w-full xl:block"><defs><marker id={`${uid}-branch`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="var(--accent)"/></marker></defs><path d="M0 320H16M16 80V560" fill="none" stroke="var(--accent)" strokeWidth="1.5"/>{[80,240,400,560].map(y=><path key={y} d={`M16 ${y}H41`} stroke="var(--accent)" markerEnd={`url(#${uid}-branch)`}/>)}</svg>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{cards.map(card=><section key={card.name} className="flex min-w-0 flex-col justify-center rounded-lg border border-neutral-200 bg-background p-3 xl:h-[148px]"><h4 className="mb-2 text-center text-sm font-bold text-primary">{card.name}</h4><div className="mx-auto w-full max-w-[360px] [&>svg]:h-[110px] [&>svg]:w-full">{card.figure}</div></section>)}</div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs leading-5 text-neutral-600">Illustrative sensing outputs · the spectral curve draws across the bands, clears, and repeats.</p><button type="button" onClick={()=>setPaused(!paused)} aria-pressed={paused} className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-bold text-accent motion-reduce:hidden">{paused?'Play spectral curve':'Pause spectral curve'}</button></div>
    </div>;
}
