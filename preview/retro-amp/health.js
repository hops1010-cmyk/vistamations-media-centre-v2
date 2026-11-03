const definitions = [
  ["amp", "Power amp", "Master volume, stereo balance and output gate."],
  ["eq", "EQ", "Equalizer response, bypass and processing headroom."],
  [
    "video",
    "Video player",
    "Playback, frame delivery, decode failures and buffering.",
  ],
  [
    "audio",
    "Audio",
    "Playback and audio health; clipping overrides the indicator to red.",
  ],
  [
    "processor",
    "Processor",
    "5a Modulator · 5b Diffuser. Track their performance and todos here.",
  ],
  [
    "kaggle",
    "Kaggle interface",
    "Interface connectivity, request success and outstanding integration work.",
  ],
  ["svg", "SVG / GSAP", "Editor, player, timeline and menu performance."],
  [
    "broll",
    "B-roll downloads",
    "Download completion, failures and outstanding media tasks.",
  ],
];
const key = "vistamations.retro-amp.health.v1";
const records = Object.fromEntries(
  definitions.map(([id]) => [
    id,
    {
      score: null,
      status: "unknown",
      source: "Not measured",
      updated: null,
      detail: "",
      todos: [],
    },
  ]),
);
let selected = "amp",
  clipping = null,
  storageAvailable = true;
const el = (id) => document.getElementById(id);
try {
  const saved = JSON.parse(localStorage.getItem(key) || "{}");
  for (const [id] of definitions) {
    const r = saved[id];
    if (!r || typeof r !== "object") continue;
    // Telemetry is never restored as a current measurement after a page restart.
    if (r.source === "Manual assessment") {
      records[id].score =
        Number.isInteger(r.score) && r.score >= 0 && r.score <= 100
          ? r.score
          : null;
      records[id].status =
        ["good", "attention"].includes(r.status) && records[id].score !== null
          ? r.status
          : "unknown";
      records[id].source = r.source;
      records[id].updated = typeof r.updated === "string" ? r.updated : null;
    }
    records[id].todos = Array.isArray(r.todos)
      ? r.todos
          .filter(
            (t) => t && typeof t.text === "string" && typeof t.id === "string",
          )
          .slice(0, 200)
          .map((t) => ({
            id: t.id,
            text: t.text.slice(0, 240),
            done: t.done === true,
          }))
      : [];
  }
} catch {
  storageAvailable = false;
}
function save() {
  try {
    localStorage.setItem(key, JSON.stringify(records));
  } catch {
    storageAvailable = false;
  }
  if (!storageAvailable)
    document.querySelector(".storage-note").textContent =
      "Browser storage unavailable. Changes work in this page but may not survive a reload.";
}
function effective(id) {
  return id === "audio" && clipping === true ? "attention" : records[id].status;
}
function renderSlots() {
  const root = el("health-slots");
  if (!root.children.length)
    definitions.forEach(([id, name], index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "health-slot";
      button.dataset.component = id;
      button.innerHTML =
        '<span class="slot-name"></span><span class="slot-meter" aria-hidden="true"><i></i></span><output></output><span class="slot-todos"></span>';
      button.querySelector(".slot-name").textContent = `${index + 1}. ${name}`;
      button.addEventListener("click", () => {
        selected = id;
        render();
      });
      root.append(button);
    });
  for (const [id, name] of definitions) {
    const r = records[id],
      button = root.querySelector(`[data-component="${id}"]`),
      status = effective(id),
      open = r.todos.filter((t) => !t.done).length,
      clip = id === "audio" && clipping === true;
    button.dataset.status = status;
    button.setAttribute("aria-pressed", String(id === selected));
    button.querySelector("output").textContent = clip
      ? "CLIP"
      : r.score === null
        ? "—"
        : r.score;
    button.querySelector(".slot-todos").textContent = String(open);
    button.querySelector("i").style.width = `${r.score ?? 0}%`;
    button.setAttribute(
      "aria-label",
      `${name}: ${clip ? "Clipping; needs attention" : status === "unknown" ? "Not assessed" : status === "good" ? "Good" : "Needs attention"}, ${r.score === null ? "no score" : r.score + " out of 100"}, ${open} outstanding todos`,
    );
    button.title = button.getAttribute("aria-label");
  }
}
function render() {
  renderSlots();
  const r = records[selected],
    definition = definitions.find(([id]) => id === selected);
  el("component-heading").textContent = definition[1];
  el("component-description").textContent = definition[2];
  el("reading-origin").textContent =
    r.source + (r.updated ? " · " + new Date(r.updated).toLocaleString() : "");
  el("performance-score").value = r.score ?? "";
  el("performance-status").value = r.status;
  el("performance-detail").textContent =
    (selected === "audio" && clipping === true
      ? "CLIPPING — sample peak reached or exceeded 0 dBFS. "
      : "") + r.detail;
  el("todo-count").textContent =
    `${r.todos.filter((t) => !t.done).length} outstanding · ${r.todos.filter((t) => t.done).length} complete`;
  el("todo-list").replaceChildren();
  for (const todo of r.todos) {
    const li = document.createElement("li"),
      label = document.createElement("label"),
      input = document.createElement("input"),
      text = document.createElement("span"),
      remove = document.createElement("button");
    input.type = "checkbox";
    input.checked = todo.done;
    input.addEventListener("change", () => {
      todo.done = input.checked;
      save();
      render();
    });
    text.textContent = todo.text;
    label.append(input, text);
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove todo: " + todo.text);
    remove.addEventListener("click", () => {
      r.todos = r.todos.filter((t) => t.id !== todo.id);
      save();
      render();
    });
    li.append(label, remove);
    el("todo-list").append(li);
  }
  if (!r.todos.length) {
    const li = document.createElement("li");
    li.textContent = "No todos recorded.";
    el("todo-list").append(li);
  }
}
el("performance-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = el("performance-score").value,
    score = value === "" ? null : Number(value),
    status = el("performance-status").value;
  Object.assign(records[selected], {
    score,
    status: score === null ? "unknown" : status,
    source: "Manual assessment",
    updated: new Date().toISOString(),
    detail: "Manually supplied assessment; not a measured benchmark.",
  });
  save();
  render();
});
el("clear-reading").addEventListener("click", () => {
  Object.assign(records[selected], {
    score: null,
    status: "unknown",
    source: "Not measured",
    updated: null,
    detail: "",
  });
  save();
  render();
});
el("todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = el("todo-text").value.trim();
  if (!text) return;
  if (records[selected].todos.length >= 200) {
    el("todo-text").setCustomValidity(
      "Remove an existing todo before adding more (200 maximum).",
    );
    el("todo-text").reportValidity();
    return;
  }
  records[selected].todos.push({
    id: crypto.randomUUID(),
    text: text.slice(0, 240),
    done: false,
  });
  el("todo-text").value = "";
  save();
  render();
});
el("todo-text").addEventListener("input", () =>
  el("todo-text").setCustomValidity(""),
);
window.retroAmpHealth = Object.freeze({
  getState: () =>
    structuredClone({ components: records, audioClipping: clipping }),
  setReading(
    id,
    {
      score = null,
      status = "unknown",
      source = "Telemetry adapter",
      detail = "",
    },
  ) {
    if (!Object.hasOwn(records, id)) throw new Error("Unknown component");
    if (score !== null && (!Number.isFinite(score) || score < 0 || score > 100))
      throw new Error("Score must be null or 0–100");
    if (!["unknown", "good", "attention"].includes(status))
      throw new Error("Invalid condition");
    Object.assign(records[id], {
      score: score === null ? null : Math.round(score),
      status: score === null ? "unknown" : status,
      source: String(source).slice(0, 120),
      detail: String(detail).slice(0, 600),
      updated: new Date().toISOString(),
    });
    render();
  },
  setAudioPeak(peak) {
    if (peak !== null && (!Number.isFinite(peak) || peak < 0))
      throw new Error("Peak must be null or a non-negative linear sample peak");
    clipping = peak === null ? null : peak >= 1;
    render();
  },
});
render();
save();
