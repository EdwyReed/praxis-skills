/**
 * Zero-dependency terminal UI primitives (Clack-inspired).
 * Works on modern Windows terminals, macOS, and Linux TTYs.
 */

const ESC = "\u001b[";
const isColor =
  process.env.NO_COLOR == null &&
  process.env.FORCE_COLOR !== "0" &&
  (process.stdout.isTTY || process.env.FORCE_COLOR === "1");

const c = {
  reset: isColor ? `${ESC}0m` : "",
  bold: isColor ? `${ESC}1m` : "",
  dim: isColor ? `${ESC}2m` : "",
  italic: isColor ? `${ESC}3m` : "",
  green: isColor ? `${ESC}32m` : "",
  yellow: isColor ? `${ESC}33m` : "",
  blue: isColor ? `${ESC}34m` : "",
  magenta: isColor ? `${ESC}35m` : "",
  cyan: isColor ? `${ESC}36m` : "",
  red: isColor ? `${ESC}31m` : "",
  gray: isColor ? `${ESC}90m` : "",
  bgBlue: isColor ? `${ESC}44m` : "",
  white: isColor ? `${ESC}37m` : "",
};

const S = {
  bar: `${c.gray}│${c.reset}`,
  start: `${c.cyan}┌${c.reset}`,
  step: `${c.cyan}◆${c.reset}`,
  done: `${c.green}◇${c.reset}`,
  end: `${c.cyan}└${c.reset}`,
  active: `${c.cyan}●${c.reset}`,
  inactive: `${c.gray}○${c.reset}`,
  checked: `${c.green}◼${c.reset}`,
  unchecked: `${c.gray}◻${c.reset}`,
  ok: `${c.green}✓${c.reset}`,
  fail: `${c.red}✗${c.reset}`,
  warn: `${c.yellow}!${c.reset}`,
  pointer: `${c.cyan}›${c.reset}`,
};

export function supportsInteractiveUi(stdin = process.stdin, stdout = process.stdout) {
  return Boolean(stdin.isTTY && stdout.isTTY && !process.env.CI);
}

function write(stdout, text) {
  stdout.write(text);
}

function line(stdout, text = "") {
  write(stdout, `${text}\n`);
}

function hideCursor(stdout) {
  write(stdout, `${ESC}?25l`);
}

function showCursor(stdout) {
  write(stdout, `${ESC}?25h`);
}

function clearLines(stdout, count) {
  if (count <= 0) return;
  for (let i = 0; i < count; i += 1) {
    write(stdout, `${ESC}1A${ESC}2K`);
  }
}

export function intro(title, { stdout = process.stdout, version } = {}) {
  const badge = version ? `${c.dim}  v${version}${c.reset}` : "";
  line(stdout);
  line(stdout, `${S.start}  ${c.bold}${c.cyan}${title}${c.reset}${badge}`);
  line(stdout, S.bar);
}

export function outro(message, { stdout = process.stdout, hint } = {}) {
  line(stdout, S.bar);
  line(stdout, `${S.end}  ${c.bold}${c.green}${message}${c.reset}`);
  if (hint) line(stdout, `   ${c.dim}${hint}${c.reset}`);
  line(stdout);
}

export function note(title, lines = [], { stdout = process.stdout } = {}) {
  line(stdout, `${S.done}  ${c.bold}${title}${c.reset}`);
  for (const item of lines) {
    line(stdout, `${S.bar}  ${item}`);
  }
  line(stdout, S.bar);
}

export function logStep(message, { stdout = process.stdout } = {}) {
  line(stdout, `${S.step}  ${message}`);
  line(stdout, S.bar);
}

export function logSuccess(message, { stdout = process.stdout } = {}) {
  line(stdout, `${S.bar}  ${S.ok}  ${message}`);
}

export function logWarn(message, { stdout = process.stdout } = {}) {
  line(stdout, `${S.bar}  ${S.warn}  ${c.yellow}${message}${c.reset}`);
}

export function logFail(message, { stdout = process.stdout } = {}) {
  line(stdout, `${S.bar}  ${S.fail}  ${c.red}${message}${c.reset}`);
}

export function printErrorPretty(message, { stdout = process.stderr } = {}) {
  line(stdout);
  line(stdout, `${c.red}${c.bold}✗  ${message}${c.reset}`);
  line(stdout);
}

/**
 * Read a single keypress in raw mode. Returns normalized key names.
 */
function readKey(stdin) {
  return new Promise((resolve, reject) => {
    const onData = (buffer) => {
      cleanup();
      const raw = buffer.toString("utf8");
      resolve(normalizeKey(raw));
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      stdin.off("data", onData);
      stdin.off("error", onError);
    };
    stdin.on("data", onData);
    stdin.on("error", onError);
  });
}

function normalizeKey(raw) {
  if (raw === "\u0003") return "ctrl-c";
  if (raw === "\r" || raw === "\n") return "enter";
  if (raw === "\u001b" || raw === "\u001b\u001b") return "escape";
  if (raw === " " || raw === "\u00a0") return "space";
  if (raw === "\u001b[A" || raw === "\u001bOA") return "up";
  if (raw === "\u001b[B" || raw === "\u001bOB") return "down";
  if (raw === "\u001b[C" || raw === "\u001bOC") return "right";
  if (raw === "\u001b[D" || raw === "\u001bOD") return "left";
  // Windows / some terminals send longer sequences
  if (raw.includes("[A")) return "up";
  if (raw.includes("[B")) return "down";
  if (raw === "a" || raw === "A") return "a";
  if (raw === "n" || raw === "N") return "n";
  if (raw === "y" || raw === "Y") return "y";
  return raw;
}

async function withRawMode(stdin, fn) {
  const previousRaw = stdin.isRaw;
  const wasPaused = typeof stdin.isPaused === "function" ? stdin.isPaused() : false;
  if (typeof stdin.setRawMode === "function") stdin.setRawMode(true);
  if (typeof stdin.resume === "function") stdin.resume();
  try {
    return await fn();
  } finally {
    if (typeof stdin.setRawMode === "function") {
      try {
        stdin.setRawMode(Boolean(previousRaw));
      } catch {
        /* ignore terminals that reject setRawMode after close */
      }
    }
    // Leaving stdin flowing after raw-mode prompts keeps the Node event loop alive.
    if (!wasPaused && typeof stdin.pause === "function") stdin.pause();
  }
}

/** Release TTY input so the process can exit after interactive flows. */
export function releaseStdin(stdin = process.stdin) {
  try {
    if (typeof stdin.setRawMode === "function" && stdin.isTTY) stdin.setRawMode(false);
  } catch {
    /* ignore */
  }
  if (typeof stdin.pause === "function") stdin.pause();
  if (typeof stdin.removeAllListeners === "function") {
    stdin.removeAllListeners("data");
    stdin.removeAllListeners("keypress");
  }
}

/**
 * Single-select (radio). options: { value, label, hint? }[]
 */
export async function select({
  message,
  options,
  initialValue,
  stdin = process.stdin,
  stdout = process.stdout,
}) {
  if (!options.length) throw new Error("select() requires options.");
  let index = Math.max(
    0,
    options.findIndex((option) => option.value === initialValue),
  );
  if (index < 0) index = 0;
  let rendered = 0;

  const paint = () => {
    clearLines(stdout, rendered);
    const rows = [];
    rows.push(`${S.step}  ${c.bold}${message}${c.reset}`);
    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      const active = i === index;
      const bullet = active ? S.active : S.inactive;
      const label = active ? `${c.bold}${option.label}${c.reset}` : option.label;
      const hint = option.hint ? `  ${c.dim}${option.hint}${c.reset}` : "";
      rows.push(`${S.bar}  ${bullet} ${label}${hint}`);
    }
    rows.push(`${S.bar}  ${c.dim}↑↓ move  ·  enter confirm${c.reset}`);
    rows.push(S.bar);
    for (const row of rows) line(stdout, row);
    rendered = rows.length;
  };

  hideCursor(stdout);
  try {
    return await withRawMode(stdin, async () => {
      paint();
      while (true) {
        const key = await readKey(stdin);
        if (key === "ctrl-c" || key === "escape") {
          showCursor(stdout);
          throw Object.assign(new Error("Cancelled."), { exitCode: 130 });
        }
        if (key === "up") index = (index - 1 + options.length) % options.length;
        else if (key === "down") index = (index + 1) % options.length;
        else if (key === "enter") {
          clearLines(stdout, rendered);
          const chosen = options[index];
          line(stdout, `${S.done}  ${c.bold}${message}${c.reset}`);
          line(stdout, `${S.bar}  ${S.ok}  ${chosen.label}`);
          line(stdout, S.bar);
          return chosen.value;
        } else {
          continue;
        }
        paint();
      }
    });
  } finally {
    showCursor(stdout);
  }
}

/**
 * Multi-select (checkboxes). options: { value, label, hint?, selected? }[]
 */
export async function multiselect({
  message,
  options,
  stdin = process.stdin,
  stdout = process.stdout,
  required = true,
}) {
  if (!options.length) throw new Error("multiselect() requires options.");
  const state = options.map((option) => ({
    ...option,
    selected: Boolean(option.selected),
  }));
  let index = 0;
  let rendered = 0;

  const paint = () => {
    clearLines(stdout, rendered);
    const rows = [];
    rows.push(`${S.step}  ${c.bold}${message}${c.reset}`);
    for (let i = 0; i < state.length; i += 1) {
      const option = state[i];
      const active = i === index;
      const box = option.selected ? S.checked : S.unchecked;
      const label = active ? `${c.bold}${option.label}${c.reset}` : option.label;
      const cursor = active ? ` ${S.pointer}` : "  ";
      const hint = option.hint ? `  ${c.dim}${option.hint}${c.reset}` : "";
      rows.push(`${S.bar}${cursor}${box} ${label}${hint}`);
    }
    const count = state.filter((option) => option.selected).length;
    rows.push(
      `${S.bar}  ${c.dim}↑↓ move  ·  space toggle  ·  a all  ·  n none  ·  enter confirm${c.reset}`,
    );
    rows.push(`${S.bar}  ${c.dim}${count} selected${c.reset}`);
    rows.push(S.bar);
    for (const row of rows) line(stdout, row);
    rendered = rows.length;
  };

  hideCursor(stdout);
  try {
    return await withRawMode(stdin, async () => {
      paint();
      while (true) {
        const key = await readKey(stdin);
        if (key === "ctrl-c" || key === "escape") {
          showCursor(stdout);
          throw Object.assign(new Error("Cancelled."), { exitCode: 130 });
        }
        if (key === "up") index = (index - 1 + state.length) % state.length;
        else if (key === "down") index = (index + 1) % state.length;
        else if (key === "space") state[index].selected = !state[index].selected;
        else if (key === "a") {
          const allOn = state.every((option) => option.selected);
          for (const option of state) option.selected = !allOn;
        } else if (key === "n") {
          for (const option of state) option.selected = false;
        } else if (key === "enter") {
          const selected = state.filter((option) => option.selected);
          if (required && !selected.length) {
            // flash required message in place
            clearLines(stdout, rendered);
            line(stdout, `${S.step}  ${c.bold}${message}${c.reset}`);
            line(stdout, `${S.bar}  ${S.warn}  ${c.yellow}Select at least one agent${c.reset}`);
            line(stdout, S.bar);
            rendered = 3;
            await new Promise((resolve) => setTimeout(resolve, 450));
            paint();
            continue;
          }
          clearLines(stdout, rendered);
          line(stdout, `${S.done}  ${c.bold}${message}${c.reset}`);
          if (!selected.length) {
            line(stdout, `${S.bar}  ${c.dim}none${c.reset}`);
          } else {
            for (const option of selected) {
              line(stdout, `${S.bar}  ${S.checked} ${option.label}`);
            }
          }
          line(stdout, S.bar);
          return selected.map((option) => option.value);
        } else {
          continue;
        }
        paint();
      }
    });
  } finally {
    showCursor(stdout);
  }
}

/**
 * Yes/no confirm styled as radio.
 */
export async function confirm({
  message,
  initialValue = true,
  stdin = process.stdin,
  stdout = process.stdout,
}) {
  const value = await select({
    message,
    initialValue: initialValue ? "yes" : "no",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No / cancel" },
    ],
    stdin,
    stdout,
  });
  return value === "yes";
}

export function formatPath(pathValue) {
  const home = process.env.USERPROFILE || process.env.HOME || "";
  if (home && pathValue.startsWith(home)) {
    return `~${pathValue.slice(home.length).replaceAll("\\", "/")}`;
  }
  return pathValue.replaceAll("\\", "/");
}

export { c, S };
