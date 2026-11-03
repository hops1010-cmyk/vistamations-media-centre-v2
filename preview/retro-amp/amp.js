const layout = await fetch("assets/control-layout.json").then((r) => {
  if (!r.ok) throw new Error("Control layout unavailable");
  return r.json();
});
const gsap = window.gsap;
if (!gsap)
  throw new Error("GSAP unavailable; run npm install before starting preview");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const amp = document.querySelector(".amp");
const state = { volume: 35, balance: 0, power: false };
const refs = new Map();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const balanceText = (value) =>
  value === 0
    ? "CENTRE"
    : `${Math.abs(value)}% ${value < 0 ? "LEFT" : "RIGHT"}`;
const duration = () => (reduced.matches ? 0 : 0.18);

function position(element, bounds) {
  Object.assign(element.style, {
    left: `${(bounds.x / layout.design_canvas.width) * 100}%`,
    top: `${(bounds.y / layout.design_canvas.height) * 100}%`,
    width: `${(bounds.width / layout.design_canvas.width) * 100}%`,
    height: `${(bounds.height / layout.design_canvas.height) * 100}%`,
  });
}
function scale(kind) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 120 120");
  svg.classList.add("scale");
  svg.setAttribute("aria-hidden", "true");
  for (let i = 0; i <= 30; i++) {
    const radians = ((-135 + i * 9) * Math.PI) / 180;
    const r = i % 5 ? 55 : 53;
    const line = document.createElementNS(ns, "line");
    for (const [key, value] of Object.entries({
      x1: 60 + Math.sin(radians) * r,
      y1: 60 - Math.cos(radians) * r,
      x2: 60 + Math.sin(radians) * 58,
      y2: 60 - Math.cos(radians) * 58,
    }))
      line.setAttribute(key, value);
    if (i % 5 === 0) line.classList.add("major");
    svg.append(line);
  }
  const labels =
    kind === "volume"
      ? [
          [-135, "0"],
          [0, "50"],
          [135, "100"],
        ]
      : [
          [-135, "L"],
          [0, "C"],
          [135, "R"],
        ];
  for (const [angle, label] of labels) {
    const r = (angle * Math.PI) / 180,
      t = document.createElementNS(ns, "text");
    t.setAttribute("x", 60 + Math.sin(r) * 68);
    t.setAttribute("y", 63 - Math.cos(r) * 68);
    t.textContent = label;
    svg.append(t);
  }
  return svg;
}
function render(emit = true) {
  for (const kind of ["volume", "balance"]) {
    const { button, rotor } = refs.get(kind);
    const rotation =
      kind === "volume" ? -135 + state.volume * 2.7 : state.balance * 1.35;
    gsap.to(rotor, {
      rotation,
      duration: duration(),
      ease: "power2.out",
      overwrite: true,
    });
    button.setAttribute("aria-valuenow", state[kind]);
    button.setAttribute(
      "aria-valuetext",
      kind === "volume"
        ? `${state.volume} percent`
        : balanceText(state.balance),
    );
    document.getElementById(`${kind}-readout`).textContent =
      kind === "volume" ? `${state.volume}%` : balanceText(state.balance);
  }
  const power = refs.get("power");
  power.setAttribute("aria-pressed", String(state.power));
  gsap.to(power.querySelector(".rocker"), {
    rotationX: state.power ? -18 : 18,
    y: state.power ? -1 : 1,
    duration: duration(),
    overwrite: true,
  });
  gsap.to(".lamp", {
    backgroundColor: state.power ? "#b8d46c" : "#212c1a",
    boxShadow: state.power
      ? "0 0 12px #b8d46c88, inset 0 1px 2px #fff8"
      : "0 0 0 2px #4c493f, inset 0 1px 3px #000",
    duration: duration(),
    overwrite: true,
  });
  document.getElementById("power-readout").textContent = state.power
    ? "ON"
    : "OFF";
  document.getElementById("status").textContent =
    `OUTPUT ${state.power ? "ON" : "OFF"} · CONTROL PREVIEW`;
  if (emit)
    amp.dispatchEvent(
      new CustomEvent("ampchange", { bubbles: true, detail: { ...state } }),
    );
}
function set(kind, value) {
  state[kind] =
    kind === "power"
      ? Boolean(value)
      : Math.round(clamp(Number(value), kind === "volume" ? 0 : -100, 100));
  render();
}
for (const [kind, id] of [
  ["volume", "dial-left"],
  ["balance", "dial-right"],
]) {
  const control = layout.controls.find((c) => c.id === id);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "control dial";
  button.id = kind;
  button.setAttribute("role", "slider");
  button.setAttribute(
    "aria-label",
    kind === "volume" ? "Master volume" : "Stereo balance",
  );
  button.setAttribute("aria-valuemin", kind === "volume" ? "0" : "-100");
  button.setAttribute("aria-valuemax", "100");
  button.setAttribute("aria-orientation", "vertical");
  button.innerHTML =
    '<span class="dial-rotor"><span class="indicator"></span></span><span class="dial-label" aria-hidden="true">' +
    (kind === "volume" ? "VOL" : "BAL") +
    "</span>";
  button.append(scale(kind));
  position(button, control.bounds);
  document.getElementById("controls").append(button);
  refs.set(kind, { button, rotor: button.querySelector(".dial-rotor") });
  let drag;
  button.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    button.focus();
    button.setPointerCapture(e.pointerId);
    drag = {
      id: e.pointerId,
      y: e.clientY,
      value: state[kind],
      scale: amp.getBoundingClientRect().width / 1536,
    };
  });
  button.addEventListener("pointermove", (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    set(
      kind,
      drag.value +
        ((drag.y - e.clientY) / (2 * drag.scale)) * (e.shiftKey ? 0.2 : 1),
    );
  });
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    button.addEventListener(event, () => (drag = undefined));
  button.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 1 : 5;
    const moves = {
      ArrowUp: step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowLeft: -step,
      PageUp: 10,
      PageDown: -10,
    };
    if (e.key in moves) {
      e.preventDefault();
      set(kind, state[kind] + moves[e.key]);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      set(kind, e.key === "Home" ? (kind === "volume" ? 0 : -100) : 100);
    } else if (
      kind === "balance" &&
      (e.key === "0" || e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      set(kind, 0);
    }
  });
  button.addEventListener("dblclick", () => {
    if (kind === "balance") set(kind, 0);
  });
  button.addEventListener(
    "wheel",
    (e) => {
      if (document.activeElement !== button) return;
      e.preventDefault();
      set(kind, state[kind] + (e.deltaY < 0 ? 1 : -1));
    },
    { passive: false },
  );
}
const power = document.createElement("button");
power.type = "button";
power.id = "power";
power.className = "control power";
power.setAttribute("aria-label", "Master power");
power.innerHTML = '<span class="rocker" aria-hidden="true"></span>';
position(power, layout.controls.find((c) => c.id === "power-switch").bounds);
document.getElementById("controls").append(power);
refs.set("power", power);
power.addEventListener("click", () => set("power", !state.power));
window.retroAmp = Object.freeze({
  getState: () => ({ ...state }),
  setState(next) {
    for (const kind of ["volume", "balance"])
      if (Number.isFinite(next[kind]))
        state[kind] = Math.round(
          clamp(next[kind], kind === "volume" ? 0 : -100, 100),
        );
    if (typeof next.power === "boolean") state.power = next.power;
    render();
  },
});
render(false);
