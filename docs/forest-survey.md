# Remote Sensing forest survey

This is an illustrative reconstruction inspired by the supplied aerial plot, not a measured or georeferenced dataset. The featured project retains `/research/phenomics-remote-sensing/`; the interactive viewer lives at `/research/phenomics-remote-sensing/flight/`.

## Editing

- Project descriptions and flight asset URLs: `content/research-projects/phenomics-remote-sensing.toml`.
- Featured placement: `featured = true` on its entry in `content/research.toml`.
- Seed, plot dimensions, survey bounds, altitude, duration, and footprint: `src/lib/flight/survey-config.json`.
- Trees, terrain, curved road, drone geometry, and the projected SVG poster: `scripts/generate-forest-survey.mjs`.
- Shared flight path and coverage: `src/lib/flight/survey.ts`.

Run `npm run generate:forest` after changing the model or configuration, then `npm run build`. Commit the generated GLB and poster with the source. Generation is deterministic; no remote assets or image-generation services are involved.

The GLB contains instanced vegetation and a named `SurveyDrone` object. Flight animation and survey coverage run in the website rather than being baked into the downloaded model. The poster is an orthographic-style projection of the same tree/road coordinates. The viewer loads Three.js only on the client and is compatible with the static export and configured base path.

## Interaction and fallback

The preview automatically loops the initial 15 seconds unless reduced motion is enabled. The expanded viewer starts paused. Play, pause, restart, speed, timeline, overview, free orbit, and drone follow are supported. In Free orbit, drag to rotate, right-drag to pan, scroll to zoom, or use two-finger gestures. Focus the canvas and use arrow keys to pan; zoom buttons are also available. Choose Overview to reset the view.

Rendering suspends when the canvas is offscreen or the document is hidden. Mobile uses a lower pixel ratio and skips shadow rendering on initial load. WebGL or asset failures retain a poster, explanation, and access to the model download.

## Verification performed

- TypeScript and Next.js production export.
- Independent GLB load: 584 trunks, 2,336 canopy instances, curved road, and named drone.
- Sampled the flight at 1,001 positions: finite coordinates, continuous movement, and altitude above the tallest canopy (23.52 model units versus flight altitude 29).
- All 340 survey cells are reached by the route.
- Browser checks: featured placement, preview animation, full viewer navigation, 90-second completion with 100% coverage, restart, keyboard timeline, speed and camera selection, and responsive layout.
