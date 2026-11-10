import * as THREE from 'three';
import config from './survey-config.json';
export { config };

/** Smooth survey passes with semicircular turns outside the surveyed rectangle. */
export function createSurveyPath() {
    const { minX, maxX, minZ, maxZ } = config.surveyBounds;
    const path = new THREE.CurvePath<THREE.Vector3>();
    const altitude = config.altitude;
    for (let x = minX, lane = 0; x <= maxX; x += config.laneSpacing, lane++) {
        const forward = lane % 2 === 0;
        const start = new THREE.Vector3(x, altitude, forward ? minZ : maxZ);
        const end = new THREE.Vector3(x, altitude, forward ? maxZ : minZ);
        path.add(new THREE.LineCurve3(start, end));
        if (x < maxX) {
            const extension = (forward ? 1 : -1) * config.laneSpacing * 0.67;
            path.add(new THREE.CubicBezierCurve3(end,
                new THREE.Vector3(x, altitude, end.z + extension),
                new THREE.Vector3(x + config.laneSpacing, altitude, end.z + extension),
                new THREE.Vector3(x + config.laneSpacing, altitude, end.z)));
        }
    }
    return path;
}

export function createCoverage(path: THREE.CurvePath<THREE.Vector3>) {
    const cells: { x: number; z: number; arrival: number }[] = [];
    const bounds = config.surveyBounds;
    const samples = Array.from({ length: 901 }, (_, i) => path.getPoint(i / 900));
    for (let x = bounds.minX; x <= bounds.maxX; x += 6) {
        for (let z = bounds.minZ; z <= bounds.maxZ; z += 6) {
            const arrival = samples.findIndex(p => Math.abs(p.x - x) <= config.footprintWidth / 2 && Math.abs(p.z - z) <= config.footprintDepth / 2);
            cells.push({ x, z, arrival: arrival < 0 ? Infinity : arrival / 900 });
        }
    }
    return cells;
}
