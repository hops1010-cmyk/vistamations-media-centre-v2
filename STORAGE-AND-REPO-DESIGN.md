# Media Centre v2 — bento, storage index and cross-platform Git design

Design phase only. Pete requested bento/iframes, headless browsing, four server/storage clusters with D1 as the main index, Google Drive/Supabase plus TeraBox/Dropbox, Git restore repositories and keeping repositories current so they work cross-platform. No cloud structures, Git synchronization, restore tests or automation were executed by this document.

## Interface and browser service

Bento tiles contain first-party player/editor/timeline/library/amp components directly. Iframes are an optional isolated tile for explicitly approved external tools or previews, not the main editor architecture. Frame permissions/sandbox/CSP and message origins are explicit; cross-site pages may refuse embedding, in which case offer Open externally. Never assume an iframe can read another origin's DOM or browser storage. Tiles store layout/preset, integration ID and safe configuration, never credentials.

Headless browser is a backend job service for permitted screenshots, thumbnails, page extraction and integration/browser QA. Cloudflare Browser Run is a candidate; a local browser runner is the offline/local option. Neither is an FFmpeg substitute. API connectors remain preferred for storage. A flaky API is handled by retry/resume/reconciliation, not silent login scraping. User-granted browser sessions, site terms and permitted actions must be established before automation. Cloudflare's headless engine is not proof of Firefox compatibility; actual Firefox tests are separate.

## Cluster identity remains open

D1 is the canonical online indexing database; R2 is Cloudflare's object store. Pete's term “D2 buckets” is retained as unresolved, not silently changed into a real provisioned product. The four cluster membership remains pending Pete's answer. Known requested services: Cloudflare, Google Drive and Supabase; Dropbox and TeraBox are additional requested connectors. Local storage is required for offline use but has not been silently assigned as cluster four. Show actual configured clusters/connectors rather than inventing four healthy deployments.

Every provider gets an adapter: authorize, capabilities, list/delta, upload/resume, metadata/checksum, fetch, move where supported and delete with explicit scope. Provider IDs, versions, checksums, path/case sensitivity and rate limits differ. Mark unsupported features honestly. No TeraBox API entitlement, Google Drive reliability or Supabase/Dropbox credentials have been verified.

## One index, readable recovery structure across services

Logical text structure to mirror wherever supported; object-key prefixes for buckets, folders/files for Drive/Dropbox-like services. This is a design layout, not folders already created in accounts.

```text
vistamations/media-centre-v2/
  index/catalog.json                 portable checkpoint of D1 records
  index/catalog.jsonl                chunked rebuild records
  index/README.txt                   version, authority and recovery instructions
  projects/<project-id>/<revision>/manifest.json
  projects/<project-id>/<revision>/summary.txt
  assets/<hash-prefix>/<content-hash>/<asset-name>
  restores/<restore-id>/manifest.json
  restores/<restore-id>/verification.json
```

D1 tables: projects, project_revisions, assets, storage_locations, replicas, connectors, sync_jobs, repositories, repository_checkouts, restore_points, restore_assets and verification_runs. Index text summaries, tags, asset names, MIME/container/codec, project/clip references, transcripts when generated, source/license evidence and searchable provenance. Large media stays outside D1. Full-text search is an implementation choice to validate; do not equate basic filenames with a complete content index.

Every replica record includes provider/cluster ID, native object ID/key, logical path, byte count, available checksum with algorithm, project/revision, upload state, provider version, last verified time and error/retry state. Map one logical asset to multiple locations without duplicating its identity. Never equate provider ETags with a proven SHA-256 content match. Index export/checkpoints carry sequence/schema/snapshot hash and creation time; they are recovery mirrors, not rival canonical indexes. Check manifests and retained source evidence during rebuild before promoting a restored D1 catalog.

Write local-first; queue each replica independently. A failed Drive upload remains pending while independent storage succeeds. Retry transient errors with backoff and idempotency; distinguish authentication failure. Preserve read-back/hash verification status per copy. Do not report “backed up to all four” until all configured destinations verify. No automatic deletion propagation across providers. Keep D1/source manifests recoverable without embedding account tokens or signed URLs.

## Git restore repositories

Version code, design, schemas, migrations, safe example configuration, dependency locks, component provenance, patches and recovery instructions. Restore-point manifest references exact repo/commit, schema revision, release artifact checksum and required media hashes/locations. Code and configuration restore is separate from user-data/media restore. A Git tag alone is not a tested restoration; restore into an isolated destination and verify project open, media references and compatible migrations before marking verified.

Public Git excludes credentials, private account data, media and private index exports. Store private recovery metadata separately, with public manifests carrying safe opaque IDs only. No claim that every Git repository is public or that all existing repos have been inspected. No force-push, dirty-worktree reset, default-branch rewrite or automatic merge over conflicts. Existing Git branches need real remote/commit evidence, not Tower organizational labels.

## Keeping repositories current and cross-platform

Maintenance goal: synchronized, traceable, tested releases. Build/deploy phase implementation should inventory actual repo paths/remotes/owners, distinguish Pete's repos from third-party checkouts, record local modifications, compare tracked branches and upstream releases, then apply reviewed compatible changes. Check for secrets before publishing. Dependency upgrades are separate changes with lockfile/license review; do not blindly follow latest or interpret stars as compatibility evidence.

Portability contract: shared project schema, relative/case-consistent paths, portable filenames, no hard-coded C: paths or Windows-only scripts in the app core, feature-detected browser storage/codecs/output APIs, adapter-based native integrations and exact pinned versions. Native helper packages are OS-specific; unsupported capabilities remain visible with a fallback. Data/device paths and credentials stay outside portable project manifests.

Compatibility matrix proposed for Build: Windows/macOS/Linux with actual Firefox as primary; Chromium/Edge as additional targets, Safari assessed separately; Screen/Monitor/TV layouts with keyboard navigation. Record actual OS/browser versions and tested capabilities instead of promising every smart-TV browser. Checks: install/build, import/save/reopen, split/stitch/move/swap, output controls, supported MP4 export, offline restart, storage retry/conflict recovery and secret scanning. Validate native helper separately on each supported OS. Use one versioned core; report conditional codec/device features explicitly.

Repository/cluster dashboard tiles: branch and commit, upstream delta, dirty/conflicted status, last compatibility result, storage/index lag, pending transfers, restore-point verification and exact errors. Ongoing scheduling is only a proposed feature; no background maintenance task is installed by these design documents.

## Primary sources checked

- D1: https://developers.cloudflare.com/d1/
- R2: https://developers.cloudflare.com/r2/
- Browser Run: https://developers.cloudflare.com/browser-run/
- Drive file search: https://developers.google.com/workspace/drive/api/guides/search-files
- Supabase Storage: https://supabase.com/docs/guides/storage
- Dropbox API entry: https://www.dropbox.com/developers/documentation/http/documentation (requires JS; detailed endpoint behavior not verified here).
- TeraBox integration docs found: https://www.terabox.com/integrations/docs/chinese (discovery only; account-specific integration not established).

Quality 86/100, self-assessed design. Cluster four/D2 naming, actual repo inventory/ownership, API entitlements and compatibility results remain open. This extends the design; no provisioning, build or deploy claimed.
