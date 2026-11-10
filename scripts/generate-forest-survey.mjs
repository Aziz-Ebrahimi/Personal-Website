/** Deterministic, illustrative reconstruction; no measured elevations or sensor data. */
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const config = JSON.parse(await readFile(new URL('../src/lib/flight/survey-config.json', import.meta.url), 'utf8'));
// GLTFExporter uses the browser FileReader API for binary serialization.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(result => { this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`; this.onloadend?.(); }); }
};
let seed = config.seed;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const scene = new THREE.Scene();
scene.name = 'IllustrativeForestSurvey';
scene.userData = { description: 'Simulated forest inspired by the supplied aerial plot; not a georeferenced reconstruction.', seed: config.seed };
const material = color => new THREE.MeshStandardMaterial({ color, roughness: 1 });
const groundMaterial = material('#829166');
const terrainHeight = (x, z) => 0.5 * Math.sin(x / 38) * Math.cos(z / 46);
const terrainGeometry = new THREE.PlaneGeometry(config.width, config.depth, 30, 40);
terrainGeometry.rotateX(-Math.PI / 2);
const positions = terrainGeometry.attributes.position;
for (let i = 0; i < positions.count; i++) positions.setY(i, terrainHeight(positions.getX(i), positions.getZ(i)));
terrainGeometry.computeVertexNormals();
const ground = new THREE.Mesh(terrainGeometry, groundMaterial); ground.name = 'Terrain'; scene.add(ground);
const base = new THREE.Mesh(new THREE.BoxGeometry(config.width, 2, config.depth), material('#596547')); base.position.y = -1.4; base.name = 'PlotBase'; scene.add(base);
const roadZ = x => -72 + 10 * Math.exp(-(((x - 12) / 36) ** 2));
const roadVertices = [], roadIndices = [];
for (let i = 0; i <= 60; i++) { const x = -75 + i * 2.5; for (const side of [-1, 1]) roadVertices.push(x, terrainHeight(x, roadZ(x)) + 0.12, roadZ(x) + side * 2.4); if (i < 60) { const a = i * 2; roadIndices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } }
const roadGeo = new THREE.BufferGeometry(); roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadVertices, 3)); roadGeo.setIndex(roadIndices); roadGeo.computeVertexNormals();
const road = new THREE.Mesh(roadGeo, new THREE.MeshStandardMaterial({color:'#ddd5bd', roughness:1, side:THREE.DoubleSide})); road.name = 'CurvedNorthernRoad'; scene.add(road);
const trees = [];
const addTree = (x,z,border) => { if (Math.abs(z-roadZ(x)) < 5) return; const height = border ? 10 + random()*9 : 6 + random()*8; trees.push({x,z,height,radius:height*(0.21+random()*0.08), tone:Math.floor(random()*5)}); };
for(let row=0;row<18;row++) for(let column=0;column<15;column++) {
  if(random()<0.13) continue;
  const x=-48+column*6.7+(random()-.5)*1.7, z=-51+row*6.7+(random()-.5)*1.8;
  // Irregular gaps and paths, similar to the reference plot.
  if((x>-15&&x<-9&&z<5)||(x>22&&x<31&&z>34)) continue;
  addTree(x,z,false);
}
for(let z=-96;z<=96;z+=5.1) for(let x=-71;x<=71;x+=5.1) {
  const edge=Math.abs(x)>54||z>74||z<-58;
  if(!edge || (z<-75&&x>-22&&x<33) || random()<0.1) continue;
  addTree(x+(random()-.5)*3,z+(random()-.5)*3,true);
}
const dummy = new THREE.Object3D();
const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.24,.48,1,6),material('#61513b'),trees.length); trunks.name='TreeTrunks';
trees.forEach((t,i)=>{ dummy.position.set(t.x,terrainHeight(t.x,t.z)+t.height*.32,t.z); dummy.scale.set(1,t.height*.64,1); dummy.rotation.set(0,0,0); dummy.updateMatrix(); trunks.setMatrixAt(i,dummy.matrix); }); scene.add(trunks);
const colors=['#3f6235','#537a3d','#688847','#78944d','#466c3b'];
const crownGeometry=new THREE.IcosahedronGeometry(1,1);
for(let tone=0;tone<colors.length;tone++) {
 const group=trees.filter(t=>t.tone===tone);
 const crowns=new THREE.InstancedMesh(crownGeometry,material(colors[tone]),group.length*4); crowns.name=`Canopy${tone}`;
 group.forEach((t,i)=>{ for(let lobe=0;lobe<4;lobe++) { const angle=lobe*Math.PI*2/3; const spread=lobe===3?0:t.radius*.45; dummy.position.set(t.x+Math.cos(angle)*spread,terrainHeight(t.x,t.z)+t.height*(lobe===3?.86:.68),t.z+Math.sin(angle)*spread); dummy.scale.set(t.radius*(lobe===3?.85:1),t.radius*(lobe===3?1.05:.88),t.radius*(.85+random()*.2)); dummy.rotation.set(random()*.3,random()*Math.PI,random()*.2); dummy.updateMatrix(); crowns.setMatrixAt(i*4+lobe,dummy.matrix); }}); scene.add(crowns);
}
const drone=new THREE.Group();drone.name='SurveyDrone';
const body=new THREE.Mesh(new THREE.BoxGeometry(1.8,.65,2.4),material('#e8ece8')); body.name='DroneBody'; drone.add(body);
const dark=material('#263738');
for(const x of [-1,1]) for(const z of [-1,1]) {
 const arm=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,3.3,6),dark); arm.rotation.z=Math.PI/2; arm.rotation.y=x*z*Math.PI/4; arm.position.set(x*1.3,0,z*1.3);drone.add(arm);
 const motor=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.4,8),dark);motor.position.set(x*2.4,.25,z*2.4);drone.add(motor);
 const propeller=new THREE.Mesh(new THREE.BoxGeometry(2.1,.04,.16),dark);propeller.name=`Rotor_${x}_${z}`;propeller.position.set(x*2.4,.5,z*2.4);drone.add(propeller);
}
const camera=new THREE.Mesh(new THREE.SphereGeometry(.35,8,6),dark);camera.position.y=-.6;drone.add(camera);drone.position.set(-48,config.altitude,-52);scene.add(drone);
await mkdir(new URL('../public/models/',import.meta.url),{recursive:true});
const binary=await new GLTFExporter().parseAsync(scene,{binary:true,onlyVisible:true});
await writeFile(new URL('../public/models/forest-survey.glb',import.meta.url),Buffer.from(binary));
// Render an orthographic SVG poster from the same generated terrain/tree coordinates.
const view=new THREE.PerspectiveCamera(42,16/9,1,1000);view.position.set(175,180,220);view.lookAt(0,0,0);view.updateMatrixWorld();
const project=(x,y,z)=>{const p=new THREE.Vector3(x,y,z).project(view);return [(p.x+1)*640,(1-p.y)*360];};
const points=list=>list.map(([x,y,z])=>project(x,y,z).map(n=>n.toFixed(1)).join(',')).join(' ');
let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#eaf1ed"/><stop offset="1" stop-color="#cfded3"/></linearGradient></defs><rect width="1280" height="720" fill="url(#sky)"/><polygon points="${points([[-75,0,-100],[75,0,-100],[75,0,100],[-75,0,100]])}" fill="#829166"/>`;
svg+=`<polyline points="${points(Array.from({length:61},(_,i)=>[-75+i*2.5,.2,roadZ(-75+i*2.5)]))}" fill="none" stroke="#ddd5bd" stroke-width="8"/>`;
for(const t of [...trees].sort((a,b)=>(a.x+a.z)-(b.x+b.z))) { const [x,y]=project(t.x,t.height*.75,t.z);const [bx,by]=project(t.x,0,t.z); const radius=Math.abs(project(t.x+t.radius,t.height*.75,t.z)[0]-x);svg+=`<path d="M${bx},${by}L${x},${y}" stroke="#61513b" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="${radius*1.2}" ry="${radius*1.4}" fill="${colors[t.tone]}"/>`; }
svg+='</svg>';await writeFile(new URL('../public/models/forest-survey-poster.svg',import.meta.url),svg);
console.log(`Generated forest-survey.glb (${(binary.byteLength/1024/1024).toFixed(2)} MB), ${trees.length} trees, named drone, and scene-projected poster.`);
