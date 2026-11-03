# Vistamations Media Centre v2

Label: Media Centre · Phase: Design (2/3 of Pete's current Plan–Design–Build sequence).

Fresh standalone initiative. Pete explicitly clarified that v2 must not be confused with v1. No inherited v1 architecture, code, assets, project files or deployment assumptions. The numeral is Pete's version label; it does not authorize migration or reuse. Existing editors remain untouched.

Design steward: Cody. Theme/skin design handoff: Stef; no message has been sent to Stef. Branding: **Created by Vistamations Media Division**.

- [Product, functions and interaction design](DESIGN.md)
- [Architecture, project model and implementation handoff](ARCHITECTURE.md)
- [Master volume, balance, power and EQ — first design priority](MASTER-AMP-DESIGN.md)
- [Backend responsibilities, endpoints and offline operation](BACKEND-DESIGN.md)
- [Bento, storage indexing, Git restores and cross-platform maintenance](STORAGE-AND-REPO-DESIGN.md)
- [Skin-matched motion plugin, source snippets and Sisyphus motif](MOTION-PLUGIN-DESIGN.md)
- [VISTAMATIONS brand, dark luxury/atomic visual direction and vector prompts](VISTAMATIONS-VISUAL-DIRECTION.md)

The full Media Centre remains in Design. A separately authorized [retro master-amp overlay preview](preview/retro-amp/README.md) is built: GSAP volume/balance knobs and power switch on Pete's supplied faceplate, available locally on port 3216 using `npm run preview:amp`. Audio-engine integration remains pending. Public repository: https://github.com/hops1010-cmyk/vistamations-media-centre-v2. No production deployment was created. Intended app URL: https://www.vistamations.com/svg (not deployed by this work). Preserve existing localhost services, especially port 3000.

The active Tower session/project is distinct from an app user's Media Centre project. No completed Tower project number or restore point is allocated by these documents.
