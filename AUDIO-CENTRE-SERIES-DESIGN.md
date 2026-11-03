# VISTAMATIONS Audio Centre v2 · series architecture

Status: Design proposal, 2026-11-04. Pete named **Merlin Series**, **Elite Series** and **Ultimate Series**, with base-model features, functions, processes, operators and structure shared by all three. The following tier differences are Cody's proposals for review; they are not built or a pricing/licensing decision.

Audio Centre is the shared audio subsystem within the fresh Vistamations Media Centre v2. These series do not create a new standalone media player, three repositories, three project formats or a new version of v1.

## Command tree

```text
system -architecture
  --app
    ---features
    ---functions
    ---processes
    ---operators
    ---structure
```

`system` is the category; `-architecture` its main branch; `--app` the next branch; the five `---` entries are siblings under app. Each extra dash denotes one deeper branch here. This is a design/description request, not authority to build or deploy all described branches.

| Branch | Meaning in this architecture | Example |
| --- | --- | --- |
| Features | Capabilities the user can access | Shared audio timeline, EQ, health panel |
| Functions | Specific actions available through those capabilities | Split a clip; centre balance; save a project |
| Processes | Ordered workflows coordinating functions/operators | Import → inspect → place → split → stitch → preview → export |
| Operators | Defined operations applied to project data or signals | Split, move, swap, trim, gain, balance, output gate |
| Structure | Containers, modules and relationships that make the app work | Shared core → audio chain → UI adapters → storage |

Here an operator is an app operation, not an agent/person. Editing operators change project state through undoable commands; audio operators process the monitored signal. Processor/Modulator/Diffuser names remain component roles until their exact signal behavior is specified.

## Shared base model — every series

| Area | Required common capability |
| --- | --- |
| Master amp | Power On/Off, master volume, true left/right balance, output profiles |
| EQ | Usable EQ, flat/reset, bypass and visible headroom/clipping state |
| Editing | Import, split, stitch, move, swap, trim, image duration, linked media, undo/redo |
| Timeline | Shared Visual/Text/Audio tracks; movable clips; extensible tracks; shared media project |
| Media | One player/library with vector and video modes; images/audio/video may cross modes |
| Interface | File, Edit, SVG, ASCII, IPTV, Settings; bento layout; keyboard access; reduced motion |
| Files | Local open/save, portable project manifest/media references, MP4 export within verified capabilities |
| Offline | Cached/local editing and local persistence; online sources/sync show actual availability |
| Health | Eight component slots, /100 readings with evidence/source/time, clipping indication, component todos/manual |
| Reliability | Preserve source media, explicit errors, recoverable edits, conflict preservation and verified restore status |
| Brand | VISTAMATIONS identity and compatible skin tokens; skin selection is separate from series |

Do not remove Pete's requested split/stitch/move/swap workflow, EQ, the shared timeline or health/todo functions from Merlin to create tier differences. Common planned functions remain planned in every series until implemented. A series name cannot manufacture hardware support, a live adapter, a measured health score or unlimited browser capability.

## Proposed differences

| Dimension | Merlin Series | Elite Series | Ultimate Series |
| --- | --- | --- | --- |
| Purpose | Complete, straightforward everyday listening and editing | Faster repeated editing and more precise control | Larger production workflows and expandable processing |
| Controls | Direct amp controls, standard EQ and essential inspector | Expanded routing/processing inspector and reusable presets | Configurable processing/routing workspace with inspected module adapters |
| Timeline workflow | Full common split/stitch/move/swap workflow | Saved selections, grouped operations and repeatable editing macros | Reusable job chains and coordinated batch workflows |
| EQ/output | Shared baseline EQ and headphone/speaker profiles | Additional saved EQ banks and A/B comparison | Versioned processing-chain presets and per-chain diagnostics |
| Processing | Shared capability-detected browser/local processing | Managed conversion/proxy queues and reusable job settings | Coordinated jobs across explicitly configured local/remote adapters |
| Monitoring | Eight slots, readings, component todos and manual | Session trend views and performance comparison | Cross-component diagnostic/history views and adapter-specific measurements |
| Workspace | Clear default layout; movable/resizable tiles | Saved task layouts and detailed inspector views | Multiple task workspaces and expanded module views |
| Operator surface | Individual operators via menus/controls | Reusable groups of those operators | Composable, validated operation chains |

No prices, track/file limits, paid services, automatic upgrades, cloud allocations or commercial entitlements are assigned. Avoid inventing hundreds of audio tools: each addition must improve Pete's repeated editing tasks. Additional signal effects and the exact Modulator/Diffuser behavior need their own definition/design before implementation.

## Structure: one application, shared core

```text
Vistamations Media Centre v2
├── Common base model
│   ├── Shared project schema + command store + undo history
│   ├── Media library + player + timeline evaluator
│   ├── Audio engine: EQ → channel balance → volume → output gate
│   ├── Processing/measurement adapter interfaces
│   ├── Eight-component health + todos + manual
│   └── Local persistence + sync/export contracts
├── Series configuration
│   ├── Merlin: base + straightforward defaults
│   ├── Elite: base + precision/workflow extensions
│   └── Ultimate: base + advanced coordination/extensions
└── Presentation
    ├── Shared controls, menus and bento tiles
    └── Independent skin/theme packs from Stef's design boundary
```

Use a versioned capability manifest to describe series defaults and optional modules, with runtime availability recorded separately. A missing API, processor adapter or backend is reported as unavailable rather than silently reclassifying the user's series. This is a contract proposal, not a new installed plugin system.

Opening the same project in another series preserves the complete project data. If a required extension is absent, identify that dependency and retain its configuration. Do not silently discard it or render/export a changed result. Changing series or skin does not rewrite source media or create a new project format.

## Processes and acceptance

The same basic process works in every series: open/import → select output → place clips → split/move/swap/trim → stitch → preview → check clipping/health/todos → save/export. Recording and online downloads additionally require actual connected sources and supported adapters.

Build acceptance, when separately authorized:

1. Run the same base workflow in each series against the same project and verify matching results.
2. Confirm series and skins can vary independently while control meanings stay stable.
3. Round-trip projects across series without deleting unsupported extension data.
4. Verify missing processing capabilities are reported before playback/export that depends on them.
5. Confirm health scores are evidence-based or labelled manual, and todos remain separate from score.
6. Test proposed advanced operators for valid transactions, undo and failure recovery before enabling them.

Still to settle: exact Elite/Ultimate module selections; live measurement rubrics; Modulator/Diffuser behavior; whether series will be product editions, workspace presets or both. Default design treats them as configuration profiles in one application, without a sales/paywall implementation.

Design quality: **91/100**, self-assessed. Shared architecture and boundaries are specified; tier additions remain proposals pending review. Current built scope remains the retro amp control/health preview only.
