# Retro master amplifier overlay

Scoped build authorized by Pete: GSAP knobs and switch over the supplied blank faceplate. The full Media Centre remains in Design; this component is an interactive UI preview, without audio processing or Windows controls.

From the repository root:

```sh
npm ci
npm run preview:amp
```

Open http://localhost:3216/. Set `AMP_PREVIEW_PORT` to change the loopback port. No CDN or network requests are needed after installation. The server exposes only a fixed list of preview assets and binds to loopback.

## Controls

- Left: master volume, 0–100%, initially 35%.
- Right: stereo balance, -100 left through centre to +100 right.
- Rocker: master On/Off, initially Off. Remembers knob positions within the open page.
- Drag vertically, or focus a dial and use arrow keys (5 steps); Shift gives 1-step keyboard or fine drag adjustment. Home/End choose limits. Focused wheel gives 1-step changes. Balance double-click, Enter, Space or 0 restores centre.
- Reduced-motion mode applies state changes immediately.

Positions come from `assets/control-layout.json`, using its exact measured oval bounds. Percentage positioning inside the image's preserved 3:2 container scales the overlay without letterbox offsets. Image pixels are unchanged; knobs, ticks, engraving, lamp and rocker are separate HTML/CSS/SVG overlays. Knob rotation and switch/lamp transitions use [GSAP's documented tween API](https://gsap.com/docs/v3/GSAP/gsap.to%28%29/).

## Audio-engine integration

Listen on `.amp` or its ancestor for the bubbling `ampchange` event. `event.detail` is `{volume, balance, power}`. Use `window.retroAmp.getState()` for a snapshot or `window.retroAmp.setState({volume: 40, balance: 0, power: true})` to update controls. No events contain credentials and no preferences are stored or sent anywhere. When integrating, replace the preview-only status and connect state to the reviewed master audio chain; balance must attenuate channels independently rather than pan/mix them.

## Assets and dependencies

Faceplate and layout were supplied by Pete for this project. Their inclusion does not establish an open-source license or separate third-party clearance. Original image SHA-256 is recorded in the local change receipt. GSAP 3.15.0 is pinned in the lockfile and retains its upstream license; it is not labelled OSI open source. This use animates interface controls only.

## Validation — 2026-11-04

Actual Firefox and Chromium headless browser checks passed: volume limits/keyboard, balance left/centre, power toggle, pointer drag, 1440px and 600px alignment/no horizontal overflow, reduced-motion interaction, and zero page errors. The Firefox screenshot was visually inspected. No DSP, touch hardware or OS audio-routing verification is claimed.
