# Media Centre v2 — backend design

Design only. No resources provisioned, credentials accessed, code implemented or deployments made.

## Responsibilities

| Component | Responsibility |
| --- | --- |
| Browser/local app | Player, Vector/Video/ASCII tools, shared library/timeline, master volume/balance/EQ, local project persistence, available media processing and offline work. |
| Cloudflare Worker | Authenticated project/media API, sync coordination, signed upload/download authorization, B-roll connector, curated IPTV catalog and job/status metadata. |
| D1 | Project identities/revisions, preferences, R2 asset index, source/license records, upload sessions and sync outcomes. |
| R2 | Media, recordings, proxies, finished exports and versioned project manifests/packages as needed. |
| Optional local helper | Heavy native FFmpeg jobs and supported IPTV recording. Explicit authenticated pairing, loopback binding and origin checks; no arbitrary shell commands. Not required for basic browser editing. |
| Credentials adapter | Backend-only named credential retrieval. Tower vault existence/access path remains unverified; provision approved Worker secrets only through a verified private route. Never put keys in the public repository or frontend. |

## Data flow and endpoints

Proposed prefix /svg/api. Exact routes and schema are design contracts pending implementation.

1. Save writes local project metadata first. A sync outbox holds pending revision operations.
2. GET /projects and /projects/:id return owner-authorized project listings/manifests. PUT /projects/:id/revisions requires a base revision; mismatch returns a conflict with both versions preserved. Project deletion explicitly identifies local/cloud scope.
3. POST /uploads creates an owner/project-bound resumable upload session. Upload parts directly to private R2 through bounded signed requests; complete only after checking part completion, object size and metadata. D1 records uploading/available/failed states. Downloads are separately authorized and support the media access pattern needed by playback.
4. GET /broll/search uses configured provider credentials server-side; results carry provider/source URL/license/attribution evidence. Import fetches a chosen item, stores a local copy and queues optional R2 sync. Do not label arbitrary Internet Archive material royalty-free.
5. GET /iptv/channels returns a curated eight-entry target catalog with proposed/verified status and dated NSW evidence. Source-specific recording/playback adapters enforce technical support; no generic open proxy or presumed DRM access. Live streams require internet.
6. GET/PUT /preferences sync portable settings. Physical output-device selection stays machine-local. Headphone/speaker profile values may be portable, but never imply the same hardware routing elsewhere.
7. Processing jobs run in the browser or paired helper. Persist/export status as appropriate; do not assign native FFmpeg execution to ordinary Worker requests. All jobs retain a project revision so edits during processing do not silently change output.

## Authentication and boundaries

Single owner, Pete. Proposed Cloudflare Access or reviewed app authentication; verify JWT issuer/audience/signature and all serving hostnames. Browser requests cannot establish identity merely by supplying an email header. Private buckets, ownership-checked project/object keys and minimal credential permissions. No secrets in manifests, logs, SVG metadata, browser bundles or Git.

Public app destination https://www.vistamations.com/svg, with /svg and /svg/* routing bounded to this app. Inspect existing routes before Deploy; preserve store.vistamations.com and existing base/localhost services. Backend adapters share interfaces between local dev and edge; local browser data and public-origin browser data are distinct and require package transfer or authenticated explicit sync.

Offline capabilities: cached app, downloaded media/processors, editing, local saves and supported exports. Cloud sync, live IPTV, new B-roll searches and uncached remote objects wait for connectivity. No first-load/offline guarantee without prior caching or a local installation.

No automatic storage purge, paid resource upgrade or secret-vault reconfiguration is approved by this design. Report quota/access failures and retain local data. Build acceptance: owner authentication, conflict preservation, interrupted upload recovery, D1/R2 reconciliation, offline restart and reconnect, credential leak checks, route isolation, actual Firefox playback/export and native-helper pairing where included.

Full contracts, verified documentation links and remaining decisions: ARCHITECTURE.md. Master output/device details: MASTER-AMP-DESIGN.md. Design-stage self-assessment: 88/100; runtime behavior, credentials, channel sources and infrastructure are unverified. Build remains the next separately authorized phase.
