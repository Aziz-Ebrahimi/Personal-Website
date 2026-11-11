export default function GwasFigure() {
    const label = {fill:'var(--foreground)',fontFamily:'inherit',fontSize:12};
    const points = Array.from({length:960},(_,i)=>{
        const chr=Math.floor(i/60), position=i%60;
        const noise=((i*7919+104729)%1009)/1009;
        const baseline=-Math.log10(Math.max(.0001,noise))*.9+.15;
        const peak=(chr===4?6.9:chr===11?4.7:0)*Math.exp(-Math.pow((position-31)/5,2));
        return {x:52+chr*24+position/60*21,y:256-Math.min(9.4,baseline+peak)*18};
    });
    return <svg viewBox="0 0 760 330" role="img" aria-label="Illustrative GWAS: Manhattan plot across 16 chromosomes and QQ plot, using simulated association signals" className="w-full">
        <text {...label} x="380" y="23" textAnchor="middle" fontWeight="bold">Phenotypes + independent genomic markers</text>
        <text {...label} x="240" y="55" textAnchor="middle" fontWeight="bold">Manhattan plot</text><text {...label} x="635" y="55" textAnchor="middle" fontWeight="bold">QQ plot</text>
        {[0,2,4,6,8,10].map(n=><g key={n}><path d={`M48 ${256-n*18}H438`} stroke="var(--neutral-500)" strokeOpacity=".15"/><text {...label} x="40" y={260-n*18} textAnchor="end" fontSize="10">{n}</text></g>)}
        <path d="M48 76V256H438" stroke="var(--neutral-500)" fill="none"/>
        {points.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="1.35" fill={Math.floor(i/60)%2?'#c88e54':'var(--accent)'} opacity=".8"/>)}
        <path d="M48 148H438" stroke="#bf6e65" strokeDasharray="5 4"/><text {...label} x="435" y="140" textAnchor="end" fontSize="9">Example threshold</text>
        {Array.from({length:16},(_,i)=><text {...label} key={i} x={61+i*24} y="274" textAnchor="middle" fontSize="10">{i+1}</text>)}
        <text {...label} x="245" y="298" textAnchor="middle">Chromosome</text><text {...label} transform="translate(17 165) rotate(-90)" textAnchor="middle">−log₁₀(p)</text>
        <path d="M550 76V256H730" stroke="var(--neutral-500)" fill="none"/>
        {[0,2,4,6,8,10].map(n=><text key={n} {...label} x="542" y={260-n*18} textAnchor="end" fontSize="10">{n}</text>)}
        {[0,1,2,3,4,5,6].map(n=><text key={n} {...label} x={550+n*30} y="274" textAnchor="middle" fontSize="10">{n}</text>)}
        <path d="M550 256L730 148" stroke="#bf6e65" strokeDasharray="5 4"/>
        {Array.from({length:100},(_,i)=>{const expected=i/99*6, observed=expected+.016*Math.pow(expected,3);return <circle key={i} cx={550+expected*30} cy={256-observed*18} r="1.8" fill="var(--accent)"/>;})}
        <text {...label} x="640" y="298" textAnchor="middle">Expected −log₁₀(p)</text><text {...label} transform="translate(507 165) rotate(-90)" textAnchor="middle">Observed −log₁₀(p)</text>
        <text {...label} x="380" y="325" textAnchor="middle" fontSize="10">Simulated example · 16 chromosomes · not study results</text>
    </svg>;
}
