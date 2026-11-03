# Media Centre v2 — master amp, first design priority

Pete clarified the virtual power amp as master volume and balance, On/Off, then added EQ. This is a fresh v2 shared audio-output component, not a separate player or a guitar amplifier simulator. Current authorization remains Design; no code or sound-processing runtime was built.

## Front panel

```text
VISTAMATIONS · MASTER AMP                       [On / Off]
VOLUME   0 ─────────●───────── 100%              70%
BALANCE  L ─────────●───────── R                Centre
[EQ ▾]                                      [EQ On / Bypass]
31  63  125  250  500  1k  2k  4k  8k  16k Hz
│   │    │    │    │   │   │   │   │    │       +12 dB
●   ●    ●    ●    ●   ●   ●   ●   ●    ●         0 dB
│   │    │    │    │   │   │   │   │    │       −12 dB
[Flat]          EQ headroom / clip indicator
Created by Vistamations Media Division
```

## Output settings — Pete's next addition

Settings → Playback → Output and the amp's Settings button open the same controls:

Pete subsequently specified the visible top-level bar exactly as **File | Edit | SVG | IPTV | Settings |**. Output is reached directly from the **Settings pulldown → Audio output**; the Playback preferences page links to that same panel, not a separate settings copy. Audio output is a submenu of Settings, not an additional top-level menu or a ninth general preference category.

```text
File | Edit | SVG | IPTV | Settings |
                          └ Audio output
                             ├ Headphones
                             ├ Desktop speakers
                             ├ Output device…
                             ├ Master volume / Balance / On–Off
                             ├ Equalizer…
                             └ Windows sound settings…
```

Windows/browser integration is a design requirement: the browser controls Media Centre's own Web Audio output; supported device selection requests actual browser permission and verifies routing. Windows sound settings remains the operating-system route when selection is unsupported. System-wide Windows volume/balance/default-device manipulation requires a separately paired native adapter; it is not supplied by a normal browser page. Show only working actions or explain unavailable integration; no claim that a local helper or Windows patch exists. Any helper must follow the loopback pairing/origin restrictions in ARCHITECTURE.md. No OS settings were changed by this design.

- **Headphones / Desktop speakers**: named listening profiles. Each remembers its own volume, balance and EQ, while master On/Off remains explicit. Profile switches smoothly apply saved settings; first-time profile uses flat EQ and centred balance. No invented acoustic correction or loudness/safety claim.
- **Output device**: Default (Windows), plus devices Firefox exposes through an explicit permission/selection flow. Named profile and physical device are distinct: selecting “Headphones” alone cannot guarantee that Windows routes sound to them.
- Runtime-detect and test output routing for the actual audio path. This amp uses Web Audio; an HTML media element's setSinkId alone does not establish where an AudioContext is routed. Use a supported AudioContext output-selection mechanism, or an explicitly tested alternate routing adapter. If unavailable, show **Managed by Windows** with a brief instruction to choose headphones/speakers in Windows sound settings; leave profile controls usable.
- Require successful device switching before displaying that device as active. Report permission denial or disconnection, retain preferences, silence/ask on device loss rather than silently blast a different output, and never persist device permission as a secret-free guarantee that survives browser resets.
- Optional labelled **Test output** plays only on deliberate action, respects master Off and volume, and offers immediate Stop. No automatic test tone. Physical device selection is a local preference and is not synced as if device identifiers were portable across machines.

Build checks add independent profile persistence, switching without audio discontinuities, actual headphone/speaker routing, denied permissions, unplugged output, unsupported API fallback and no silent OS-device claim. Primary references: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/selectAudioOutput ; https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/setSinkId ; https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId . API presence and actual behavior remain untested in Pete's Firefox.

User-approved functions: master Volume, Balance, On/Off, EQ. Proposed control details: ten familiar frequency bands, +/-12 dB range, flat default, adjustable numeric values and collapsible EQ drawer. Default startup volume 70% and restored-value behaviour are proposals; no actual hearing-safety threshold is implied.

- On/Off gates audible output; Off means silent, not an unprocessed bypass. Keep volume, balance and EQ settings. Transport, recording, project editing and background exports remain independent. Show an explicit muted state while playhead continues.
- Volume adjusts the shared monitored mix; zero is silence. Store and display a 0–100% value mapped to an explicit gain curve. On never resets it to full volume. Restore preferences without starting playback; resume audio on a user gesture when required.
- Balance is true stereo balance: centre preserves both channels; left attenuates only the right, right attenuates only the left. Do not implement stereo balance by moving/mixing the opposite channel into the chosen channel. Proposed range -100 left to +100 right, centre 0. Provide a Centre action and keyboard/numeric control.
- EQ applies the same band settings to both channels. Flat sets all band gains to 0 dB; bypass preserves the values but removes tonal processing. Do not confuse EQ bypass with master Off. Individual EQ faders have names, units, focus indicators and arrow-key increments.
- Proposed monitoring chain: selected playback source/mixed timeline → EQ with boost headroom → stereo channel balance → master volume → smooth output gate → device. Avoid duplicate direct media-element audio paths. Route the active player/IPTV or timeline mix explicitly; do not unintentionally sum several playing sources.
- EQ uses shared native Web Audio filters; not a separate workstation. Smooth gain/filter changes and power transitions to avoid clicks. Bound filter frequencies against actual sample rate; clearly mark unavailable upper bands. Show clipping/headroom honestly; no claim of a limiter unless implemented and tested.
- Listening controls should be app preferences, separate from project clip gains. Proposed default: exports use the project mix and ignore master listening Volume/Balance/EQ. An explicit later “Apply master processing to export” control, with matching offline processing and verification, can change that. This default awaits Pete's clarification; no silently altered exports.
- Skin follows Stef's current package; the same controls/units work in Enterprise, Medieval, Kittens, Retro 70s, Space Age and African Animals. No brand skins copied from commercial products. Panel is a dockable/resizable bento tile with compact Volume/Balance/Power controls in the player.

## Repository decision for this component

Recommended: a small Vistamations-owned master amp using native Web Audio GainNode, channel split/merge and BiquadFilterNode. Browser APIs are built into Firefox; no external DSP repository is required for these four functions. Use the app's selected accessible UI primitives and Stef's token package. Repo popularity does not justify importing an entire player or amp simulator for a few controls.

Research references, not installed dependencies:

- Webamp (Jordan Eldredge): https://github.com/captbaritone/webamp — established skinnable browser-player reference, not the master-amp engine and not adopted wholesale.
- HF1 web: https://github.com/YarinCardillo/hf1-web — niche browser hi-fi amp simulation, reference only; no license/Firefox compatibility clearance recorded here.
- Web Audio modules: https://github.com/webaudiomodules/api — future optional audio-plugin standard; not required for basic output controls and no arbitrary plugin loading authorized.

Primary API documentation checked during design:
https://developer.mozilla.org/en-US/docs/Web/API/GainNode
https://developer.mozilla.org/en-US/docs/Web/API/ChannelSplitterNode
https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime

## Build checks, not yet executed

Stereo left/right test signals: centre preserves separation, full left silences right only, full right silences left only. Volume zero and master Off silence every monitored source. Smooth transitions avoid discontinuities. Flat/bypass preserve expected response; selected EQ boost/cut has measured response and suitable headroom. Switching player/timeline sources produces no duplicate or residual audio. All controls work offline, by keyboard and across skins. Confirm export treatment with Pete before implementation freeze. Validate behavior using actual Firefox, not Chromium-only tests.

Design quality: 90/100, self-assessed; clear four-function scope and routing. EQ band choice, listening-versus-export default and actual DSP verification remain open. Design priority 1; not built or deployed.
