import { createInterface } from "node:readline/promises";
import {
  confirm,
  formatPath,
  intro,
  logFail,
  logSuccess,
  logWarn,
  multiselect,
  note,
  outro,
  select,
  supportsInteractiveUi,
  c,
  S,
} from "./ui.mjs";

export { supportsInteractiveUi };

/**
 * Full guided install wizard. Returns { scope, repoPath?, selectedAgents, tasteSkill, confirmed }.
 */
export async function runInstallWizard(distribution, detections, options = {}) {
  const stdin = options.stdin ?? process.stdin;
  const stdout = options.stdout ?? process.stdout;

  intro("Praxis Skills", { stdout, version: distribution.version });

  note("What you get", [
    `${c.dim}24 workflow skills · project context · artifact-driven delivery${c.reset}`,
    `${c.dim}Claude Code also gets Praxis-prefixed slash adapters (/praxis-feature, /praxis-init, …)${c.reset}`,
    `${c.dim}Optional Taste Skill full family (default off) · tasteskill.dev v2 experimental${c.reset}`,
    `${c.dim}Codex skill packages stay the source of truth${c.reset}`,
  ], { stdout });

  let scope = options.presetScope;
  let repoPath = options.presetRepoPath;

  if (!scope) {
    scope = await select({
      message: "Where should Praxis live?",
      initialValue: "user",
      options: [
        {
          value: "user",
          label: "User-global",
          hint: "all projects on this machine",
        },
        {
          value: "repo",
          label: "This repository",
          hint: "project-local skills only",
        },
      ],
      stdin,
      stdout,
    });
  } else {
    const label = scope === "user" ? "User-global" : "This repository";
    stdout.write(`${S.done}  ${c.bold}Where should Praxis live?${c.reset}\n`);
    stdout.write(`${S.bar}  ${S.ok}  ${label}\n`);
    stdout.write(`${S.bar}\n`);
  }

  if (scope === "repo" && repoPath === undefined) {
    repoPath = process.cwd();
  }

  const agentOptions = detections.map((entry) => {
    const status = entry.detected
      ? `${c.green}detected${c.reset}`
      : `${c.gray}not found${c.reset}`;
    const pathHint = formatPath(entry.paths.userSkills);
    const slash = entry.slashCommands ? `${c.magenta}+ slash cmds${c.reset}` : "";
    const parts = [status, pathHint, slash].filter(Boolean);
    return {
      value: entry.id,
      label: entry.label,
      hint: parts.join("  ·  "),
      selected: Boolean(entry.detected && entry.defaultSelected),
    };
  });

  const selectedAgents = await multiselect({
    message: "Which agents should receive the skills?",
    options: agentOptions,
    required: true,
    stdin,
    stdout,
  });

  // Default off. CLI --with-taste-skill forces on without a second prompt.
  let tasteSkill = false;
  if (options.tasteSkill === true) {
    tasteSkill = true;
    stdout.write(`${S.done}  ${c.bold}Taste Skill family${c.reset}\n`);
    stdout.write(`${S.bar}  ${S.ok}  Include pinned full family (v2 experimental default)\n`);
    stdout.write(`${S.bar}\n`);
  } else {
    tasteSkill = await confirm({
      message: "Also install Taste Skill full family? (tasteskill.dev, pinned, default off)",
      initialValue: false,
      stdin,
      stdout,
    });
  }

  const selectedDetections = detections.filter((entry) => selectedAgents.includes(entry.id));
  const planLines = selectedDetections.map((entry) => {
    const root =
      scope === "user"
        ? formatPath(entry.paths.userSkills)
        : entry.id === "claude-code"
          ? ".claude/skills"
          : entry.id === "cursor"
            ? ".cursor/skills"
            : ".agents/skills";
    const extra =
      entry.slashCommands && options.slashCommands !== false
        ? scope === "user"
          ? `  ${c.dim}+ ${formatPath(entry.paths.userCommands)}${c.reset}`
          : `  ${c.dim}+ .claude/commands${c.reset}`
        : "";
    return `${S.checked} ${c.bold}${entry.label}${c.reset}  ${c.dim}→${c.reset}  ${root}${extra}`;
  });

  note("Install plan", [
    `${c.bold}${selectedAgents.length}${c.reset} agent${selectedAgents.length === 1 ? "" : "s"}  ·  ${c.bold}${distribution.skills.length}${c.reset} Praxis skills  ·  scope ${c.bold}${scope}${c.reset}`,
    tasteSkill
      ? `${S.checked} Taste Skill full family  ${c.dim}(pinned · design-taste-frontend v2 experimental)${c.reset}`
      : `${c.dim}Taste Skill skipped (default)${c.reset}`,
    ...planLines,
  ], { stdout });

  if (options.dryRun) {
    logWarn("Dry run — nothing will be written.", { stdout });
  }

  const proceed = options.skipConfirm
    ? true
    : await confirm({
        message: options.dryRun ? "Show the dry-run plan?" : "Install Praxis now?",
        initialValue: true,
        stdin,
        stdout,
      });

  if (!proceed) {
    outro("Install cancelled.", { stdout, hint: "Run install again whenever you are ready." });
    return { cancelled: true };
  }

  return {
    cancelled: false,
    scope,
    repoPath: scope === "repo" ? repoPath || process.cwd() : undefined,
    selectedAgents,
    tasteSkill,
  };
}

/**
 * Non-wizard agent multiselect (when --user/--repo already provided).
 */
export async function promptAgentSelection(detections, options = {}) {
  const stdin = options.stdin ?? process.stdin;
  const stdout = options.stdout ?? process.stdout;

  if (!supportsInteractiveUi(stdin, stdout)) {
    return detections.filter((entry) => entry.detected && entry.defaultSelected).map((entry) => entry.id);
  }

  intro("Praxis Skills", { stdout, version: options.version });
  return multiselect({
    message: "Which agents should receive the skills?",
    options: detections.map((entry) => ({
      value: entry.id,
      label: entry.label,
      hint: `${entry.detected ? "detected" : "not found"}  ·  ${formatPath(entry.paths.userSkills)}${entry.slashCommands ? "  ·  + slash cmds" : ""}`,
      selected: Boolean(entry.detected && entry.defaultSelected),
    })),
    required: true,
    stdin,
    stdout,
  });
}

export async function promptYesNo(message, { stdin = process.stdin, stdout = process.stdout } = {}) {
  if (supportsInteractiveUi(stdin, stdout)) {
    return confirm({ message, initialValue: false, stdin, stdout });
  }
  if (!stdin.isTTY || !stdout.isTTY) return false;
  const terminal = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await terminal.question(`${message} [y/N] `);
    return /^y(?:es)?$/i.test(answer.trim());
  } finally {
    terminal.close();
  }
}

export function printInstallExperience(result, { stdout = process.stdout, version } = {}) {
  if (!result?.targets) return false;

  stdout.write(`${S.done}  ${c.bold}Installing…${c.reset}\n`);
  for (const target of result.targets) {
    const summary = target.summary || {};
    const copied = (summary.copied || 0) + (summary.replaced || 0);
    const skipped = summary.skipped || 0;
    const commands =
      (summary.commandsWritten || 0) + (summary.commandsReplaced || 0);
    const taste = target.tasteSkill?.summary;
    const tasteDetail = taste
      ? `taste ${(taste.copied || 0) + (taste.replaced || 0)}`
      : null;
    const detail = [
      copied ? `${copied} skills` : null,
      skipped ? `${skipped} skipped` : null,
      commands ? `${commands} slash cmds` : null,
      tasteDetail,
    ]
      .filter(Boolean)
      .join(" · ");
    logSuccess(`${c.bold}${target.agent}${c.reset}  ${c.dim}${formatPath(target.target)}${c.reset}${detail ? `  ${c.dim}(${detail})${c.reset}` : ""}`, {
      stdout,
    });
  }
  stdout.write(`${S.bar}\n`);

  if (result.dryRun) {
    outro("Dry run complete — no files were changed.", {
      stdout,
      hint: "Re-run without --dry-run to install.",
    });
  } else {
    const tasteHint = result.targets.some((target) => target.tasteSkill)
      ? " Taste Skill family installed at the pinned revision."
      : " Taste Skill was not installed (optional; use --with-taste-skill).";
    outro("Praxis is ready.", {
      stdout,
      hint: `Restart agent sessions so skill catalogs refresh. Then try $praxis-init or /praxis-init in Claude Code.${tasteHint}`,
    });
  }
  return true;
}

export function printDoctorExperience(result, { stdout = process.stdout } = {}) {
  if (!result?.targets) return false;
  stdout.write(`${S.done}  ${c.bold}Doctor${c.reset}\n`);
  for (const target of result.targets) {
    if (target.healthy) {
      logSuccess(`${c.bold}${target.agent}${c.reset}  ${c.dim}${formatPath(target.target)}${c.reset}`, { stdout });
    } else {
      logFail(`${c.bold}${target.agent}${c.reset}  ${c.dim}${formatPath(target.target)}${c.reset}`, { stdout });
      for (const check of target.checks.filter((item) => !item.healthy)) {
        stdout.write(`${S.bar}     ${c.red}missing ${check.kind} ${check.name}${c.reset}\n`);
      }
    }
  }
  stdout.write(`${S.bar}\n`);
  if (result.healthy) {
    outro("All targets look healthy.", { stdout });
  } else {
    outro("Some targets need attention.", {
      stdout,
      hint: "Run install --force for the affected agents.",
    });
  }
  return true;
}
