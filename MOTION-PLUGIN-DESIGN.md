# Media Centre v2 — skin-correlated motion plugin

Design and source research only. Pete requested good GSAP snippets correlated with theme/archetype/skin, then specified the silhouette of the man eternally pushing a rock uphill: Sisyphus. No plugin, code snippet package or artwork was built/installed. Fresh v2; no v1 inheritance.

## Motion packs for Stef

Proposed plugin name: Motion Motifs. Each skin selects a small curated motion pack. Match the emotional character through behaviour and imagery, not named psychological categories or religious jargon. Source attribution, license and adaptations remain visible to maintainers.

| Skin | Character and motif | Proposed snippets / use |
| --- | --- | --- |
| Enterprise | Composure, precision, carefully revealed detail | Short fade/rise for panels, fine highlight sweep for selected cards; GSAP core timeline and restrained Flip tile transitions. |
| Medieval | Craft, weight, thresholds and unfolding stories | DrawSVG strokes for illustrated borders; masked parchment reveal; slower settle on decorative panels. |
| Kittens | Curiosity, play and gentle recovery | Small back/elastic settle for decorative badges, staggered paw marks in an optional welcome scene. No bouncing editing targets or moving focus. |
| Retro 70s | Rhythm, warmth and expressive lettering | Staggered stripe wipes and short line/text reveals. Adapt terminal-like typography patterns to warm colours and rounded forms. |
| Space Age | Exploration, instruments and quiet orbital movement | MotionPath on decorative orbital marks; restrained cyan line draws. No unsolicited flashing HUD or fabricated instrument readings. |
| African Animals | Watchfulness, grounded movement and landscape | Silhouette reveals, slow horizon/layer movement and purposeful movement along a path. Avoid reducing the theme to generic animal-print animation. |

These mappings/durations/intensities are creative proposals. They are not effects provided out of the box by an upstream repository.

## Identified source code and primitives

1. Codrops EaseReverseClipMenu: https://github.com/codrops/EaseReverseClipMenu ; inspected https://raw.githubusercontent.com/codrops/EaseReverseClipMenu/main/js/index.js . Candidate sections: createMenuTimeline, rebuildMenuTimeline and accessibility/interrupted-close handling. MIT demo. Adapt the interruption/state pattern; replace fullscreen choreography with compact pulldown behaviour. Inspect exact GSAP version for easeReverse support; use documented fallback reversal when absent.
2. Codrops HoverGrid: https://github.com/codrops/HoverGrid ; inspected https://raw.githubusercontent.com/codrops/HoverGrid/main/js/index.js . Candidate sections: getClipPath and toggleWork. Directional masks and linked image/title entrances can inform library-card previews. MIT demo; random offsets, full-page selectors and background media must be removed/adapted. Demo-specific markup/assets are not an integration-ready plugin.
3. Codrops LineTextHoverAnimations: https://github.com/codrops/LineTextHoverAnimations . MIT repository, 156 stars shown on inspected page. Terminal-like text ideas for ASCII/Space Age and reinterpretation for Retro. Repository-level discovery only: exact effect module has not been inspected; a guessed js/index.js URL returned 404. Do not label its individual snippets reviewed yet.
4. GSAP Flip: https://gsap.com/docs/v3/Plugins/Flip/ . Tile/panel state transitions after committed layout changes, never smooth the time position of a clip being precisely dragged.
5. GSAP DrawSVG: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/ . Decorative outline reveals for borders and illustrations, not a substitute for project progress.
6. GSAP MotionPath: https://gsap.com/docs/v3/Plugins/MotionPathPlugin/ . Paths for orbits, paw marks and scene characters.
7. GSAP matchMedia: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ . Responsive/reduced-motion setup and cleanup. Pair hover with keyboard focus, pause loops when hidden, and revert on skin/plugin change.

Primary creator source: Codrops/Manoela Ilic; GSAP official documentation. Specialist snippets may have small star counts; review their code/fit rather than equating star popularity with integration quality. HoverGrid displayed 41 stars; cached Codrops org and repo pages disagreed for EaseReverseClipMenu, so no exact current count is asserted here. No release cadence/maintenance promise from small demo repositories.

## Sisyphus silhouette motif — Pete's addition

Working motif ID: sisyphus-ascent. Human silhouette, boulder, incline and a readable negative-space horizon. Meaning expressed visually: persistence, burden, repetition and return. Not a profile identity or a claim about an agent's consciousness.

Proposed loop: lean/braced ascent → approach the ridge → boulder rolls down → figure returns → repeat. Wheel/boulder rotation follows distance along the slope; body poses and foot contacts follow the climb, not just translation of a rigid cutout. Keep foreground readable at small sizes. Optional pack variations: ink silhouette on parchment (Medieval), ivory/gold relief (Enterprise), sunset silhouette (Retro), backlit horizon (Space Age). One common motif can inherit skin tokens without requiring every skin to feature it.

Vector asset brief: separate figure/body-limb groups, boulder, hill path, ridge and optional shadow; stable viewBox/pivot definitions. Original Vistamations SVG artwork or a specifically licensed asset with recorded provenance, not an assumed reusable online illustration. GSAP timeline with MotionPath/rotation can animate it later. A static single-pose silhouette is the reduced-motion alternative; a separately authored scene clip keeps its project motion independent of UI preference.

Place as an optional welcome/idle scene, theme gallery sample or deliberately added timeline animation. Do not use an eternal loop to imply a job is progressing or a backup completed. If any job UI borrows the motif, show actual separate status and pause/cancel; completion must visibly exit the loop. Avoid an unsolicited repeated failure metaphor in routine successful actions.

## Plugin controls and data

Proposed panel: Theme pack, Motif, Preview/Stop, Motion amount, Speed, Reduced motion and Reset. Save optional app-skin motion separately from project animation. An explicit Add to timeline creates editable scene data; it does not turn every menu animation into project content. Master amp controls never animate ahead of actual gain/power state or delay interaction.

Catalog fields: preset ID/version, skin tags, metaphor/mood, trigger, semantic target, source URL, inspected source section, commit/version (not yet pinned), license, asset provenance, dependency list, intensity/duration bounds, reduced-motion alternative, UI/content scope and test status. Store catalog search/index records in D1 when implemented; package metadata and approved assets can sync through Stef's Git design repository. Never fetch executable snippets from arbitrary external pages at runtime.

Preview reset is deterministic; export uses project time and fixed seeded data, not random UI hover state. Core preset renderer has no wall-clock or network dependency. React mount/unmount, repeated clicks, source cleanup and accessibility must be verified in Build, including Firefox.

## Licensing boundary and build gate

Current official GSAP license checked: https://gsap.com/community/standard-license/ . It permits many interface uses but restricts some visual animation-builder uses that compete with Webflow. Therefore skin/UI effects and user-authored animation editing/export are separate decisions. Do not label GSAP OSI open source or infer that a public repository makes all uses unrestricted. Before shipping editor-facing GSAP tools, check the applicable pinned distribution terms and obtain clarification/permission if required; native Web Animations or an appropriate open-source engine can sit behind the same preset contract if needed. MIT Codrops demo code does not override GSAP/plugin terms or asset licenses.

Design quality: 88/100. Source code was inspected for two demos; no snippet executed or benchmarked. License boundary, exact upstream commits, original silhouette artwork and Firefox integration remain pending. Design only, no build/deploy.
