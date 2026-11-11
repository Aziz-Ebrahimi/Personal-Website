const columns = [
    { title: 'RGB', rows: ['VARI', 'ExG'], note: 'Visible-light indices' },
    { title: 'Multispectral', rows: ['NDVI', 'RTVI', 'NDRE'], note: 'Spectral indices' },
    { title: 'Hyperspectral', rows: ['200+ bands', '200+ vegetation indices'], note: 'Spectral phenotypes' },
    { title: 'LiDAR', rows: ['Tree height', 'Canopy density', 'Crown dimensions'], note: 'Structural phenotypes' },
];
export default function PhenotypeFigure() {
    return <div className="grid min-w-[640px] grid-cols-4 gap-3" role="img" aria-label="Phenotypes from RGB, multispectral, hyperspectral, and LiDAR sensing">
        {columns.map((column,index)=><div key={column.title} className="overflow-hidden rounded-xl border border-accent/25 bg-background"><h4 className="border-b border-accent/20 bg-accent/10 px-2 py-4 text-center text-sm font-bold text-primary">{column.title}</h4><svg viewBox="0 0 150 85" aria-hidden="true" className="mx-auto w-full"><path d="M18 72H132" stroke="var(--accent)" opacity=".3"/>{index===3 ? <><path d="M75 67V28" stroke="#94745c" strokeWidth="4"/><ellipse cx="75" cy="30" rx="32" ry="23" fill="var(--accent)" opacity=".5"/><path d="M120 8V68M115 8H125M115 68H125" stroke="var(--accent)"/></> : <>{Array.from({length:index===2?18:6},(_,i)=><rect key={i} x={24+i*(index===2?6:18)} y={20+(i*17%22)} width={index===2?4:12} height={50-(i*17%22)} rx="2" fill="var(--accent)" opacity={.3+(i%4)*.16}/>)}</>}</svg><ul className="space-y-3 px-3 pb-5 text-center text-sm font-bold text-primary">{column.rows.map(row=><li key={row}>{row}</li>)}</ul><p className="px-3 pb-4 text-center text-xs text-neutral-600">{column.note}</p></div>)}
    </div>;
}
