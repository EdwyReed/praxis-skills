import { createInterface } from "node:readline/promises";

/**
 * Interactive multi-select for agent install targets.
 * Returns selected agent ids.
 */
export async function promptAgentSelection(detections, { stdin = process.stdin, stdout = process.stdout } = {}) {
  if (!stdin.isTTY || !stdout.isTTY) {
    return detections.filter((entry) => entry.detected && entry.defaultSelected).map((entry) => entry.id);
  }

  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    stdout.write("\nDetected coding agents (filesystem homes):\n\n");
    detections.forEach((entry, index) => {
      const mark = entry.detected ? "detected" : "not found";
      const skills = entry.paths.userSkills;
      const commands = entry.paths.userCommands ? ` + commands ${entry.paths.userCommands}` : "";
      stdout.write(
        `  ${String(index + 1).padStart(2)}. ${entry.label.padEnd(12)} [${mark}]  → ${skills}${commands}\n`,
      );
      stdout.write(`      ${entry.description}\n`);
    });

    const defaults = detections
      .map((entry, index) => (entry.detected && entry.defaultSelected ? String(index + 1) : null))
      .filter(Boolean);
    const defaultText = defaults.length ? defaults.join(",") : "none";

    stdout.write("\nSelect agents to install for (comma-separated numbers, 'all', or 'none').\n");
    stdout.write("Codex skill invocation is always preserved; Claude Code also gets slash-command adapters.\n");
    const answer = (await terminal.question(`Agents [${defaultText}]: `)).trim();

    let selectedIndexes;
    if (!answer) {
      selectedIndexes = defaults.map((value) => Number(value) - 1);
    } else if (/^all$/i.test(answer)) {
      selectedIndexes = detections.map((_, index) => index);
    } else if (/^none$/i.test(answer)) {
      selectedIndexes = [];
    } else {
      selectedIndexes = answer
        .split(/[,\s]+/)
        .map((part) => Number(part))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= detections.length)
        .map((value) => value - 1);
    }

    const unique = [...new Set(selectedIndexes)];
    if (!unique.length) {
      throw new Error("No agents selected.");
    }
    return unique.map((index) => detections[index].id);
  } finally {
    terminal.close();
  }
}

export async function promptYesNo(message, { stdin = process.stdin, stdout = process.stdout } = {}) {
  if (!stdin.isTTY || !stdout.isTTY) return false;
  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await terminal.question(`${message} [y/N] `);
    return /^y(?:es)?$/i.test(answer.trim());
  } finally {
    terminal.close();
  }
}
