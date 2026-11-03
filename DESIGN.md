# Media Centre v2 — functions, layout and interaction design

Status: fresh v2, Design 2/3. Pete's current discussion is the requirements source. Layout sizes, shortcuts and control defaults below are design proposals, not claims of existing implementation. No v1 inheritance.

## Product structure

One Media Centre app and main code repository. One media player, two editing modes, one shared project/timeline. Images, audio and video cross both modes without automatic conversion into vector shapes.

| Workspace | Primary functions |
| --- | --- |
| Player | Open media, play/pause, seek, volume, fullscreen; view IPTV and SVG animations. Adding to the timeline is explicit. |
| Vector mode | Select/move/resize vector objects; shape, pen, text, fill/stroke; SVG, GSAP animation and ASCII tools. |
| Video mode | Work with MP4/MOV/AVI and other supported inputs: split, move, trim, reorder, overlay, preview and export. |
| Shared timeline | Visual, Text and Audio default tracks; add compatible tracks; move clips within/between tracks; adjust still-image duration by dragging its edge. |
| Integrated audio | Split at playhead, move, trim, gain, simple fades and mute. No separate audio workstation or player repository. |
| FFmpeg tools | Convert, extract audio, compress, remux and run export jobs through a shared tool panel. |

Media Centre project = the editable record of assets, tracks, clips, timing, mode-specific content, layout and edit revisions. SVG is a vector asset/output; MP4 is a finished-video output. Proposed project save container below can use SVG metadata, but the project records the entire edit across both modes. It is distinct from a Tower session project.

## Screen layout

```text
File | Edit | SVG | IPTV | Settings        Project title · Saved locally
Player / Edit                 [Vector | Video]        [Import] [Export]
┌ Media / B-roll ┐ ┌ Preview / player ───────────┐ ┌ Inspector / Tools ┐
│ assets/search │ │ selection/canvas/video      │ │ clip properties   │
│               │ │ previous · play · next     │ │ virtual plugins   │
└───────────────┘ └─────────────────────────────┘ └───────────────────┘
┌ Timeline ─────────────────────────────────────────────────────────┐
│ select · split · snap     timecode      zoom − [slider] +         │
│ Visual [visibility][lock]   [image ─────────] [video ─────]         │
│ Text   [visibility][lock]       [caption ─────]                    │
│ Audio  [mute][lock]        [waveform ───────────────]              │
└───────────────────────────────────────────────────────────────────┘
Local save · Sync status · Jobs · Storage      Vistamations branding
```

Bento tiles are resizable and movable using a dedicated header grip; manipulating a clip must never move its tile. Timeline can expand edge-to-edge. Focus tile maximizes it and restores the previous layout on exit. All tiles can be recovered through Settings → Layout. Compact screens use tabbed panels; monitor uses the full arrangement; TV uses larger controls, visible focus and directional navigation. Preset names Screen/Monitor/TV change layout and scale, not project media resolution.

## Menus and commands inside the app

These are application-local menus; this document does not register new Tower commands.

Pete explicitly confirmed the hierarchy: in `menu -file --new`, `menu` is the category, a single dash denotes the main tree branch (`-file`), and a double dash denotes its first-level sub-branch (`--new`). The rendered path is Menu → File → New. Dash count denotes tree depth here, not a sequence of unrelated command flags. Deeper levels are not defined by this confirmation. This app-local design clarification does not independently amend global Tower syntax.

Pete subsequently added ASCII; current top-level bar: **File | Edit | SVG | ASCII | IPTV | Settings |**. Placement beside SVG is a design proposal. Settings → Audio output opens the shared master amp's Headphones/Desktop speakers, actual output device, volume, balance, On/Off, EQ and Windows sound-settings integration. Detailed design: MASTER-AMP-DESIGN.md. This is an output shortcut into Playback preferences, not a ninth settings category.

| Branch | Children (`--child`) |
| --- | --- |
| `menu -file` | Pete's specified primary children: `--new`, `--open`, `--save`, `--delete`, `--exit`. Earlier JSON import, Save As, Recent, project packaging and MP4 export remain required/proposed workflows, with secondary placement to resolve. |
| `menu -edit` | `--undo`, `--redo`, `--cut`, `--copy`, `--paste`, `--split`, `--duplicate`, `--delete-clips`, `--select-all` |
| `menu -svg` | `--open`, `--save`, `--project`, `--import-media`, `--import-video`, `--import-image`, `--import-audio`, `--add-shape`, `--add-text`, `--gsap` |
| `menu -ascii` | `--new`, `--open`, `--save`, `--convert-image`, `--convert-video`, `--add-to-timeline` — Pete approved the suggested children. |
| `menu -iptv` | `--channels`, `--watch`, `--record`, `--stop-recording`, `--recordings`, `--add-to-timeline` |
| `menu -settings` | `--appearance`, `--layout`, `--autosave`, `--sync`, `--playback`, `--export`, `--storage`, `--shortcuts` |

SVG → Open accepts supported media into the library, detects the format and offers Player or Add to timeline; the SVG menu name does not restrict import to SVG. SVG → Save saves the current vector composition; File → Save saves the entire Media Centre project. SVG → Project opens whole-project settings. Settings stays a top-level menu. Export controls distinguish selected vector artwork from full-timeline MP4.

Latest SVG import design proposal: a visible **Import media** submenu offers Video / Image / Audio, all using the same import validation path with type-filtered pickers. Pete explicitly permitted either the combined `menu -svg --import-media` action or direct `menu -svg --import-video`, `--import-image`, `--import-audio` actions; direct actions may remain command/shortcut routes without duplicating visible entries. Exact deeper dash syntax has not been defined. File → Open means open a Media Centre project; Delete means the explicit saved-project deletion flow. Exit first resolves unsaved changes, stops app-owned playback/jobs with a recoverable state, then leaves the workspace. A normal browser tab may require Pete to close it manually; never promise programmatic Firefox exit or closing other tabs. Pete's unfinished “btw audio is…” clarification is pending and supplies no new audio definition yet.

Pete subsequently approved these suggestions: the visible SVG Import media submenu contains Video/Image/Audio; one shared library supplies both editing modes and ASCII tools; import offers Library only or Add at playhead. File → Delete deletes the saved project through its scoped confirmation; Edit → Delete removes selected clips. File → Exit prompts for unsaved work and leaves the workspace. A compact speaker button next to playback opens the same master volume/balance/EQ controls as Settings. Initial audio compatibility test set: MP3, WAV, FLAC, AAC/M4A and OGG, subject to actual decoding/conversion tests, not a support guarantee.

Eight Settings branches: Appearance (skin, scale, reduced motion); Layout (presets, snapping, lock tiles, restore); Autosave (interval/history); Sync (automatic/manual/local only); Playback (quality/loop/proxies); Export (preset/processor); Storage (usage/download/cleanup); Shortcuts (bindings/help). Restore defaults is a footer action, not a ninth branch. No automatic age-based deletion is approved.

## Controls and feedback

| Control | Type and behaviour |
| --- | --- |
| Vector / Video | Segmented mode selector. Preserve selection/time and project contents; change tools and inspector. |
| Play / Pause | One labelled stateful button; Space toggles when keyboard focus is outside text input. |
| Split | Button or S: split selected unlocked clips at playhead. Preserve source offsets; no media rewrite. Explain if playhead is outside selection. |
| Clip edges | Video/audio trims reveal/hide source within its length. Still-image edges change duration. Audio time stretching is not implied. |
| Move | Drag clip body; time tooltip and snapping guide; prevent negative starts. Compatible track targets highlight. |
| Image duration | Numeric seconds field plus draggable edge; same command/undo behaviour for both. |
| Snap / Loop | Independent on/off switches with visible text; never rely only on colour. |
| Track lock | Toggle blocks edits; audio mute and visual visibility are separate controls. |
| Record IPTV | Red labelled Record button; elapsed timer and Stop; save partial captured material on failure where recoverable. |
| Export | Button opens scope, MP4 preset, processor choice and estimate; job offers progress, cancel and result/error. |
| Sync | Persistent status button: local only, queued, syncing, synced, conflict or failed. Open details without interrupting edits. |
| Delete project | Confirmation names the project and deletion scope. Default is local saved record only; never silently delete cloud copies or shared media. |

Drag/drop has keyboard alternatives: clip start/duration/track fields, move-left/right actions, tile preset/position controls. Menus support arrows, Escape and focus restoration. Avoid overriding Firefox's reserved shortcuts globally; Ctrl+S is handled only in the focused editor. Use explicit Save/New buttons for reliable browser operation. Errors preserve edits. Unsaved-change prompt offers Save/Discard/Cancel.

## Main workflows

### Pete-approved frequent workflows: split and stitch

Pete approved the eight suggestions following this design and added that stitching clips is frequent work. Prioritise Quick Split, stitching, an expandable timeline and recovery in the first build.

- Quick Split: drop audio/video, play, press S, move sections and save selected clips separately. Splitting is non-destructive; export selected sections requires a supported output preset.
- Stitch: multi-select clips, choose **Stitch**, review/reorder the list, choose destination track and start time, then **Place end-to-end**. Default order is timeline order; library selections show an explicit reorder list. Do not silently close gaps elsewhere or overwrite existing clips: preview placement and offer an empty compatible track on collision.
- Offer **Export stitched selection** for a single finished file. Audio-only selections use supported audio presets; a movie selection uses MP4. Timeline stitching is available without export or destructive source merging. Keep each clip editable, with one undo action for arrangement.
- Source in/out points remain respected. Default joins are hard cuts; optional transitions/fades are explicit and must show their effect on duration. Audio-only clips join on an Audio track; mixed visual types join on a Visual track. Video audio stays linked unless explicitly unlinked. Text/overlay tracks retain independent timing unless included in an explicit linked selection.
- Quick reassembly: split sections can be reordered and stitched together; source provenance remains intact. Export may stream-copy only if codec, stream parameters and cut boundaries are proven compatible; otherwise use the chosen processor to render/transcode. Never promise lossless arbitrary cuts or join containers by concatenating bytes.
- Expand timeline across the screen; Zoom to project and Zoom to selection. Linked video/audio with explicit Unlink. Clip inspector exposes start, duration, end, volume and image Fit/Fill/Original; image duration changes do not distort geometry.
- Player supports in/out markers and **Add selection to timeline** or **Add whole file**. Recovery offers local autosave, crash recovery and **Package project with media**. Initial optional tool panels: GSAP, ASCII and FFmpeg; no marketplace.

Stitch controls: toolbar **Stitch**, Edit → Stitch selection, context-menu Stitch, reorder list with keyboard Move up/Move down, total duration, destination and Place/Cancel. Disable incompatible selections with a specific reason; preserve selection/source files on cancellation or processing failure.

### Timeline movement and swapping

Pete explicitly requires moving clips along the timeline and swapping with other timeline clips. Both are primary editing actions, independent of Stitch.

- Drag a clip body to move it to a new time on the same track or a compatible unlocked track. Show a ghost, start/end time and snap guides before committing. Edges remain trim/duration handles, so a move never silently trims a clip.
- Proposed interaction: a **Move / Swap** tool selector keeps the intent explicit. In Swap mode, dropping onto a compatible clip exchanges the two clips' start times and track assignments. Highlight both destinations; preserve durations, source in/out points, effects and linked audio. Moving onto an occupied area in Move mode never silently swaps, deletes or overwrites another clip.
- Unequal durations: preview both occupied ranges. A swap is valid only if neither destination produces a negative start, violates track compatibility/locks, or collides with a third clip on those tracks. If it cannot fit, retain the original arrangement and explain why; offer **Insert before/after** as a separate action that shifts the affected sequence by the incoming clip/group duration. Existing intentional overlaps are preserved, not automatically repaired.
- Linked video/audio moves or swaps as a group. Validate every affected track, including linked audio, before committing atomically. In the initial build, Swap operates on two compatible individual clips or matching linked groups; incompatible/mixed multi-selections explain the limitation rather than partially swapping.
- Keyboard alternative: select first clip → **Swap with…** → select target → preview → confirm. Inspector start-time/track fields provide precise movement. Each move, swap or insert is one undoable action; Escape/cancel restores the prior arrangement.

Insert differs from Swap: Insert changes sequence timing; Swap exchanges positions without shortening or stretching the clips. Neither implies stitching or exporting.

1. New project → Visual/Text/Audio tracks → import → choose mode → drag to timeline → split/move/adjust duration → save project → export MP4.
2. Vector mode → create/import SVG → animate with GSAP/ASCII → place duration on timeline → combine video/images/audio → preview same project in Video mode without destructive conversion.
3. Audio import → waveform → split at playhead → move segments across audio tracks → adjust gain/fades → export within composition; optional standalone audio extraction via FFmpeg tools.
4. IPTV → choose channel → watch → record → stop → recording library → explicitly add clip to timeline. Recording eligibility and technical support are channel-specific; no bypass of DRM or authentication.
5. Offline → reopen previously cached app/project/media → edit/save/export using available processor → queue cloud changes. New IPTV, B-roll search and remote assets require internet. Local and public origins have separate browser stores: transfer via project/media package or explicit authenticated local bridge, not assumed shared IndexedDB.

## Virtual-plugin panel (proposed meaning)

Virtual plugins are optional Media Centre tool modules inside the app: GSAP animation, ASCII generator/filter, FFmpeg jobs, B-roll connector, IPTV connector and skin packages. They are not native VST/audio plugins. Each card shows Enabled, settings, version and capability/permission status. A disabled module preserves its project data and reports missing rendering capability; it must not silently flatten content.

Ship reviewed built-in modules initially. No arbitrary remote script loading. Extension contract: manifest ID/version, supported project schema, tool panel, clip-data validator, deterministic renderer where needed, disposal hooks and declared network/storage permissions. Future untrusted plugins require a separately designed isolation boundary. Imported JSON never evaluates JavaScript.

## Stef skin handoff

Latest appearance authority within this v2 design: VISTAMATIONS-VISUAL-DIRECTION.md, reflecting Pete's dark, sterile/clean, luxury-jewellery and atomic/quantum direction. The earlier colour/material suggestions below are historical proposals and must be reconciled with that direction; do not implement pale variants by default. Brand anchor is **VISTAMATIONS**. Six skins share precise usable controls while expressing distinct characters through vector motifs, texture and restrained motion.

External design repository/package supplies versioned theme tokens, icons, approved artwork, typography and optional muted-by-default sounds. Main app/player stays in the app repository. No repo was created or owner/name assigned here.

| Skin | Visual direction |
| --- | --- |
| Vistamations Enterprise (proposed default) | Black/ivory/gold, restrained jewellery-store finish, readable controls. |
| Medieval | Parchment, iron/wood motifs, decorative headings with plain control text. |
| Kittens | Soft colours, rounded panels, kitten/paw art outside editing targets. |
| Retro 70s | Orange/mustard/brown, rounded typography and restrained stripes. |
| Space Age | Dark space, chrome accents and cyan focus. |
| African Animals | Savanna palette, animal imagery and subtle patterns. |

Every skin displays “Created by Vistamations Media Division” in About and startup branding. Skins cannot change shortcut meanings, controls, project data, warning visibility or timeline precision. Deliver contrast/focus/reduced-motion states and Screen/Monitor/TV samples. Existing store receives proposed shared tokens/links only; no replacement is designed without inspecting its current implementation.
