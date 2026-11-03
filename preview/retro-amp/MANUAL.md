# VISTAMATIONS · Retro amp operator manual

## Eight vertical slots

| Slot | Component | Performance evidence to collect | Typical todos |
| --- | --- | --- | --- |
| 1 | Power amp | Actual output gate, volume response, left/right separation | Connect master chain; verify silence while Off |
| 2 | EQ | Filter response, processing headroom, bypass behavior | Verify bands; prevent boost clipping |
| 3 | Video player | Dropped frames, buffering, decode errors, seek latency | Resolve failed codec; improve frame delivery |
| 4 | Audio | Sample peaks, clipping events, dropouts | Fix clipping; verify source routing |
| 5 | Processor | Processing latency, failures, signal quality | 5a Modulator; 5b Diffuser — track separately in todo descriptions |
| 6 | Kaggle interface | Connection/request results, latency, quota errors | Configure approved adapter; retry failed request |
| 7 | SVG / GSAP | Frame timing, editor/player errors, timeline/menu responsiveness | Repair timeline action; inspect slow animation |
| 8 | B-roll downloads | Download completion, errors, content verification | Retry failed download; confirm source/license |

Kaggle was mentioned twice in Pete's list. It has one slot, leaving exactly eight components. Modulator and Diffuser belong to Processor. This is a dashboard layout, not proof that these services are implemented.

## Reading a slot

Each row has a label, an inset indicator bar, score out of 100 and an outstanding-todo count. Select a row to open the component's detailed panel. The selected row has an outline. All slots are keyboard-focusable buttons; their accessible labels include condition, numeric score and todo count.

- **Green:** an explicit good assessment or good telemetry condition.
- **Red:** explicit attention condition, or detected audio clipping.
- **Grey / dash:** not assessed or no numeric reading. Never interpreted as healthy.
- **CLIP:** current audio sample-peak warning; this overrides the color and short display, preserving the underlying score in the detail panel.

The score measures assessed component performance/health. It is **not** todo completion, an automatic benchmark, security strength or an invented uptime metric. No universal green threshold has been approved. Set the condition explicitly and explain measured evidence through the adapter's detail field. An actual automated score requires a documented per-component rubric, sample window, measurement source and freshness policy before integration.

## Manual assessments

1. Select the component.
2. Enter a whole-number performance score from 0 to 100, or leave blank for unmeasured.
3. Choose Good, Needs attention or Not assessed.
4. Select Save assessment. The panel records **Manual assessment** and its timestamp.

Clear reading resets the score/condition while preserving todos. A manual green assessment does not mean live tests ran. Power Off alone is not a component failure and does not manufacture a health reading.

## Todos

Type a task and Add. Check its box when complete; Remove deletes that task. Counts show outstanding and completed separately. Add `5a Modulator:` or `5b Diffuser:` to Processor task descriptions when relevant. Empty checklists mean no tasks recorded, not that a component is complete. Maximum 200 tasks per component, each 240 characters.

Manual assessments and todos persist in localStorage for the same browser profile and origin. They are not backed up to D1, Git or the vault. Clearing site data removes them. A different hostname/port/browser has separate storage. Storage errors produce a visible warning. Never put credentials, PINs or other secrets in todos.

## Clipping and integration

No audio processing or live component telemetry is connected in this preview. Integration API:

```js
retroAmpHealth.setReading('video', {
  score: 88,
  status: 'good', // unknown | good | attention; independent of numeric score
  source: 'Frame timing adapter',
  detail: 'Example only: replace with actual measured evidence and sampling window.'
});
retroAmpHealth.setAudioPeak(1.02); // linear sample peak >= 1: red CLIP
retroAmpHealth.setAudioPeak(0.75); // clears current sample-peak warning
retroAmpHealth.setAudioPeak(null); // detector unavailable; no invented reading
retroAmpHealth.getState(); // snapshot of component readings and todos
```

IDs: `amp`, `eq`, `video`, `audio`, `processor`, `kaggle`, `svg`, `broll`.

The future audio adapter must supply actual peaks from the monitored signal, not the volume knob position. A peak at/above 1.0 corresponds to 0 dBFS or above and triggers the sample-peak warning; this does not detect intersample true peaks. This preview has no peak-hold or historical clipping counter. Below-threshold samples clear the current warning, but do not establish good overall health. Connect an appropriate peak-hold/history policy if needed.

Telemetry is session-only and is not restored as a fresh measurement on reload. Manual readings retain their timestamps; a production adapter needs stale-reading expiry and its own defined sample window. Setting a reading does not inspect that component or execute external requests.

## Amp controls

Left knob = master volume, right = true stereo balance, rocker = master On/Off. Drag up/down; arrow keys change by five, Shift by one. Focused wheel changes by one. Home/End select limits. Double-click balance or press 0, Enter or Space to centre. Reduced-motion changes are immediate. Settings are retained only during the current page session, separately from persisted health assessments.

GSAP animates the overlays; the original image is unchanged. No Windows sound settings, production routes, export audio or other Media Centre components are modified by these controls.
