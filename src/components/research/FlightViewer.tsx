'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { assetPath } from '@/lib/assetPath';
import { config, createCoverage, createSurveyPath } from '@/lib/flight/survey';
import type { FlightAssets } from '@/types/researchProject';

type CameraMode = 'overview' | 'orbit' | 'follow';
export default function FlightViewer({ assets, preview }: { assets: FlightAssets; preview: boolean }) {
    const host = useRef<HTMLDivElement>(null);
    const droneLabel = useRef<HTMLDivElement>(null);
    const zoomRequest = useRef(1);
    const playback = useRef({ time: 0, playing: false, speed: 1, camera: 'overview' as CameraMode });
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState('');
    const [time, setTime] = useState(0);
    const [coverage, setCoverage] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [cameraMode, setCameraMode] = useState<CameraMode>('overview');
    const togglePlayback = () => {
        if (playback.current.time >= config.duration) playback.current.time = 0;
        playback.current.playing = !playback.current.playing;
        setPlaying(playback.current.playing);
    };

    useEffect(() => {
        const container = host.current;
        if (!container) return;
        let disposed = false, frame = 0, visible = false, loaded = false;
        let renderer: THREE.WebGLRenderer | undefined;
        let controls: OrbitControls | undefined;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#eaf1ed');
        const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 1200);
        const overview = new THREE.Vector3(175, 180, 220);
        camera.position.copy(overview); camera.zoom = preview ? 1.18 : 1.08; camera.updateProjectionMatrix(); camera.lookAt(0, 0, 0);
        const disposeObject = (object: THREE.Object3D) => object.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                for (const material of materials) material.dispose();
                if (child instanceof THREE.InstancedMesh) child.dispose();
            }
        });
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 640 ? 1.25 : 1.75));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.05;
            renderer.shadowMap.enabled = window.innerWidth >= 640;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.domElement.setAttribute('aria-label', '3D forest survey. Use camera and playback controls below.');
            renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
            renderer.domElement.tabIndex = 0;
            container.appendChild(renderer.domElement);
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enabled = false; controls.enableDamping = true;
            controls.listenToKeyEvents(renderer.domElement);
            controls.minDistance = 25; controls.maxDistance = 450;
            controls.maxPolarAngle = Math.PI / 2 - 0.08;
        } catch {
            renderer?.dispose();
            setError('Interactive 3D is unavailable on this device. The forest preview and model download remain available.');
            return;
        }
        const activeRenderer = renderer;
        const orbit = controls;
        scene.add(new THREE.HemisphereLight('#f2f7ff', '#6e7959', 1.6));
        const sun = new THREE.DirectionalLight('#fff2d5', 2.6); sun.position.set(-80, 150, 60); sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-150;sun.shadow.camera.right=150;sun.shadow.camera.top=150;sun.shadow.camera.bottom=-150;sun.shadow.camera.far=400;sun.shadow.normalBias=.15;scene.add(sun);
        const path = createSurveyPath();
        const route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(path.getPoints(800)), new THREE.LineBasicMaterial({ color: '#176858', transparent: true, opacity: 0.8 })); scene.add(route);
        const footprint = new THREE.Mesh(new THREE.PlaneGeometry(config.footprintWidth, config.footprintDepth), new THREE.MeshBasicMaterial({color:'#bce6ce',transparent:true,opacity:.65,depthWrite:false,side:THREE.DoubleSide}));
        footprint.rotation.x = -Math.PI / 2; scene.add(footprint);
        const beamGeo = new THREE.BufferGeometry();
        beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(24), 3));
        const beam = new THREE.LineSegments(beamGeo, new THREE.LineBasicMaterial({color:'#397c86',transparent:true,opacity:.5})); scene.add(beam);
        const cells = createCoverage(path);
        const visited = new THREE.InstancedMesh(new THREE.PlaneGeometry(5.8,5.8), new THREE.MeshBasicMaterial({color:'#61c3a7',transparent:true,opacity:.32,depthWrite:false,side:THREE.DoubleSide}), cells.length);
        visited.frustumCulled = false; scene.add(visited);
        const dummy = new THREE.Object3D();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onMotion = () => { if (reducedMotion.matches) { playback.current.playing = false; setPlaying(false); } };
        reducedMotion.addEventListener('change', onMotion);
        let drone: THREE.Object3D | undefined;
        const rotors: THREE.Object3D[] = [];
        let last = 0, lastUI = -1, lastCamera: CameraMode = 'overview';
        const update = (stamp: number) => {
            if (disposed) return;
            const delta = last ? Math.min((stamp-last)/1000, .1) : 0; last = stamp;
            const state = playback.current;
            if (loaded && state.playing) {
                state.time += delta * state.speed;
                if (preview && state.time > config.previewDuration) state.time %= config.previewDuration;
                if (!preview && state.time >= config.duration) { state.time=config.duration; state.playing=false;setPlaying(false); }
            }
            const progress = state.time/config.duration;
            const position = path.getPoint(progress);
            const tangent = path.getTangent(Math.min(progress,.99999));
            if (drone) {
                drone.position.copy(position);
                drone.rotation.y = Math.atan2(tangent.x, tangent.z);
                // Exaggerate the aircraft for visibility over the forest, especially in the thumbnail.
                drone.scale.setScalar(state.camera === 'follow' ? 2.5 : 5);
            }
            for(const rotor of rotors) rotor.rotation.y=state.time*45;
            footprint.position.set(position.x,.8,position.z);
            const beamPoints = beamGeo.attributes.position;
            for(let corner=0;corner<4;corner++) { beamPoints.setXYZ(corner*2,position.x,position.y-.7,position.z);beamPoints.setXYZ(corner*2+1,position.x+(corner%2?1:-1)*config.footprintWidth/2,.8,position.z+(corner<2?-1:1)*config.footprintDepth/2); }
            beamPoints.needsUpdate=true;beam.geometry.computeBoundingSphere();
            const tick=Math.floor(state.time*10);
            if(tick!==lastUI) {
                let count=0;
                cells.forEach((cell,i)=>{const shown=cell.arrival<=progress; if(shown)count++;dummy.position.set(cell.x,.65,cell.z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(shown?1:0);dummy.updateMatrix();visited.setMatrixAt(i,dummy.matrix);});visited.instanceMatrix.needsUpdate=true;
                setTime(state.time);setCoverage(Math.round(count/cells.length*100));lastUI=tick;
            }
            if(state.camera!==lastCamera) {
                orbit.enabled=state.camera==='orbit';
                if(state.camera!=='follow') { camera.position.copy(overview);orbit.target.set(0,0,0);camera.lookAt(0,0,0); }
                lastCamera=state.camera;
            }
            if(state.camera==='follow') {
                camera.position.copy(position).addScaledVector(tangent,-32).add(new THREE.Vector3(22,22,0));
                camera.lookAt(position.x,position.y-10,position.z);
            } else {
                if (zoomRequest.current !== 1) {camera.position.sub(orbit.target).multiplyScalar(zoomRequest.current).add(orbit.target);zoomRequest.current=1;}
                orbit.update();
            }
            const desiredZoom=(preview?1.18:1.08)*Math.min(1,camera.aspect/(state.camera==='follow'?1:1.45));
            if(camera.zoom!==desiredZoom){camera.zoom=desiredZoom;camera.updateProjectionMatrix();}
            if (droneLabel.current && drone) {
                camera.updateMatrixWorld();
                drone.updateMatrixWorld();
                const center = position.clone().project(camera);
                const corners = [-4, 4].flatMap(x => [-1, 1].flatMap(y => [-4, 4].map(z =>
                    new THREE.Vector3(x, y, z).applyMatrix4(drone!.matrixWorld).project(camera))));
                const xs = corners.map(p => (p.x + 1) * container.clientWidth / 2);
                const ys = corners.map(p => (1 - p.y) * container.clientHeight / 2);
                const left = Math.min(...xs), right = Math.max(...xs);
                const top = Math.min(...ys), bottom = Math.max(...ys);
                const width = Math.max(48, right - left + 12);
                const height = Math.max(36, bottom - top + 12);
                const marker = droneLabel.current;
                marker.style.width = `${width}px`;
                marker.style.height = `${height}px`;
                marker.style.transform = `translate(${(left + right - width) / 2}px, ${(top + bottom - height) / 2}px)`;
                marker.style.visibility = loaded && center.z > -1 && center.z < 1 && Math.abs(center.x) < 1 && Math.abs(center.y) < 1 ? 'visible' : 'hidden';
            }
            activeRenderer.render(scene,camera);
            if(visible&&!document.hidden) frame=requestAnimationFrame(update);
        };
        const resume = () => {cancelAnimationFrame(frame);last=0;if(visible&&!document.hidden) frame=requestAnimationFrame(update);};
        const observer = new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:.01});observer.observe(container);
        document.addEventListener('visibilitychange',resume);
        const resize = new ResizeObserver(()=>{const {width,height}=container.getBoundingClientRect();camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();activeRenderer.setSize(width,height,false);});resize.observe(container);
        const onContextLost = (event: Event) => {event.preventDefault();cancelAnimationFrame(frame);playback.current.playing=false;setPlaying(false);setError('The 3D view was interrupted. Reload to try again; the model download is still available.');};
        activeRenderer.domElement.addEventListener('webglcontextlost',onContextLost);
        new GLTFLoader().load(assetPath(assets.model), gltf=>{
            if(disposed) {disposeObject(gltf.scene);return;}
            scene.add(gltf.scene);drone=gltf.scene.getObjectByName('SurveyDrone');
            gltf.scene.traverse(object=>{if(object.name.startsWith('Rotor_'))rotors.push(object);if(object instanceof THREE.Mesh){object.castShadow=true;object.receiveShadow=true;}});
            loaded=true;setReady(true);
            playback.current.playing=preview&&!reducedMotion.matches;setPlaying(playback.current.playing);
        },undefined,()=>{if(!disposed){setError('The 3D model could not load. You can still view the forest preview or download the model below.');playback.current.playing=false;setPlaying(false);}});
        return () => { disposed=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',resume);reducedMotion.removeEventListener('change',onMotion);activeRenderer.domElement.removeEventListener('webglcontextlost',onContextLost);orbit.dispose();disposeObject(scene);activeRenderer.dispose();activeRenderer.domElement.remove(); };
    }, [assets.model, preview]);

    const buttonClass = 'rounded-md border border-neutral-200 bg-background px-3 py-2 text-xs font-bold text-primary disabled:opacity-50';
    return <>
        <div ref={host} className={`absolute inset-0 ${error ? 'hidden' : ''}`} />
        {!error && <div ref={droneLabel} aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 rounded-sm border-[3px] border-[#ffe600] bg-[#ffe600]/5 shadow-[0_0_0_1px_rgba(0,0,0,0.45)]"><span className="absolute -top-5 left-[-3px] rounded-t bg-[#ffe600] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-black">UAV</span></div>}
        {error ? <p role="status" className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/95 p-4 text-sm text-primary">{error}</p> : <>
            {!ready && <p role="status" className="absolute left-4 top-4 rounded bg-background/95 px-3 py-2 text-sm">Loading forest model…</p>}
            <div className="absolute left-3 top-3 rounded-lg bg-background/95 px-3 py-2 text-xs text-primary shadow-sm"><span className="font-bold">Forest survey</span><span className="ml-3">{coverage}% surveyed</span></div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-background/95 p-2 shadow-sm" aria-label="Flight controls">
                <button disabled={!ready} onClick={togglePlayback} className={buttonClass}>{playing?'Pause':'Play'}</button>
                {!preview && <>
                    <button disabled={!ready} onClick={()=>{playback.current.time=0;setTime(0);}} className={buttonClass}>Restart</button>
                    <label className="flex items-center gap-2 text-xs text-primary">Speed<select aria-label="Flight speed" value={speed} onChange={event=>{const value=Number(event.target.value);setSpeed(value);playback.current.speed=value;}} className="rounded bg-background p-2">{[.5,1,2].map(value=><option key={value} value={value}>{value}×</option>)}</select></label>
                    <label className="flex items-center gap-2 text-xs text-primary">Camera<select aria-label="Camera mode" value={cameraMode} onChange={event=>{const value=event.target.value as CameraMode;setCameraMode(value);playback.current.camera=value;}} className="rounded bg-background p-2"><option value="overview">Overview</option><option value="orbit">Free orbit</option><option value="follow">Drone follow</option></select></label>
                    {cameraMode === 'orbit' && <><button className={buttonClass} onClick={()=>{zoomRequest.current=.8;}} aria-label="Zoom in">+</button><button className={buttonClass} onClick={()=>{zoomRequest.current=1.25;}} aria-label="Zoom out">−</button></>}
                    <div className="flex min-w-[140px] flex-1 items-center gap-2 px-2"><input aria-label="Flight timeline" type="range" min="0" max={config.duration} step="0.1" value={time} disabled={!ready} onChange={event=>{playback.current.time=Number(event.target.value);setTime(Number(event.target.value));}} className="min-w-0 flex-1 accent-[var(--accent)]"/><span className="text-xs tabular-nums text-primary">{Math.floor(time)} / {config.duration}s</span></div>
                </>}
                {preview && <span className="text-xs text-neutral-600">A glimpse of the survey flight</span>}
            </div>
        </>}
    </>;
}
