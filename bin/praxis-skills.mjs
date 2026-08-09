#!/usr/bin/env node

import {
  detectAgents,
  doctorMany,
  installMany,
  loadDistribution,
  resolveInstallTargets,
  uninstallMany,
  UsageError,
} from "../lib/installer.mjs";
import { printError, printResult } from "../lib/output.mjs";
import {
  printDoctorExperience,
  printInstallExperience,
  promptAgentSelection,
  promptYesNo,
  runInstallWizard,
  supportsInteractiveUi,
} from "../lib/prompt.mjs";
import { intro, outro, printErrorPretty, releaseStdin, S, c } from "../lib/ui.mjs";

const help = `Praxis Skills

Usage:
  praxis-skills install
  praxis-skills install --user | --repo [path] | --target <skills-dir>
                        [--agents <id,id|all>] [--all-agents]
                        [--with-slash-commands | --no-slash-commands]
                        [--with-taste-skill | --no-taste-skill]
                        [--commands-target <dir>]
                        [--force] [--dry-run] [--yes] [--json]
  praxis-skills doctor  (--user | --repo [path] | --target <skills-dir>)
                        [--agents <id,id|all>] [--all-agents] [--json]
  praxis-skills uninstall (--user | --repo [path] | --target <skills-dir>)
                          [--agents <id,id|all>] [--all-agents]
                          [--dry-run] [--yes] [--json]
  praxis-skills list | version | detect [--json]

Interactive install (default on a TTY):
  praxis-skills install
    → guided UI: scope · agent checkboxes · optional Taste Skill · plan · confirm

Automation:
  praxis-skills install --user --agents codex,claude-code --yes
  praxis-skills install --user --with-taste-skill --yes
  Non-interactive default without --agents remains Codex-only.
  Taste Skill full-family install is optional and default off.

Agents:
  codex         ~/.agents/skills
  claude-code   ~/.claude/skills + slash-command adapters
  cursor        ~/.cursor/skills
  grok          ~/.grok/skills

Taste Skill (optional):
  --with-taste-skill   Install full pinned family from distribution/taste-skill.json
  --no-taste-skill     Explicitly skip (default)
  Pin + docs: https://www.tasteskill.dev/  (default primary: design-taste-frontend v2 experimental)
`;

function parseArguments(argv) {
  const command = argv.shift();
  if (!command || command === "help" || command === "--help" || command === "-h") return { command: "help" };
  if (!["install", "uninstall", "doctor", "list", "version", "detect"].includes(command)) {
    throw new UsageError(`Unknown command: ${command}`);
  }
  const options = {
    command,
    user: false,
    force: false,
    dryRun: false,
    yes: false,
    json: false,
    allAgents: false,
    slashCommands: undefined,
    // Optional Taste Skill full-family install; default off unless --with-taste-skill.
    tasteSkill: false,
  };
  while (argv.length) {
    const token = argv.shift();
    if (token === "--user") options.user = true;
    else if (token === "--force") options.force = true;
    else if (token === "--dry-run") options.dryRun = true;
    else if (token === "--yes") options.yes = true;
    else if (token === "--json") options.json = true;
    else if (token === "--all-agents") options.allAgents = true;
    else if (token === "--with-slash-commands") options.slashCommands = true;
    else if (token === "--no-slash-commands") options.slashCommands = false;
    else if (token === "--with-taste-skill") options.tasteSkill = true;
    else if (token === "--no-taste-skill") options.tasteSkill = false;
    else if (token === "--agents") {
      if (!argv.length || argv[0].startsWith("--")) throw new UsageError("--agents requires a value.");
      options.agents = argv.shift();
    } else if (token === "--commands-target") {
      if (!argv.length || argv[0].startsWith("--")) throw new UsageError("--commands-target requires a directory.");
      options.commandsTarget = argv.shift();
    } else if (token === "--target") {
      if (!argv.length || argv[0].startsWith("--")) throw new UsageError("--target requires a skills directory.");
      options.target = argv.shift();
    } else if (token === "--repo") {
      options.repo = argv.length && !argv[0].startsWith("--") ? argv.shift() : "";
    } else throw new UsageError(`Unknown option: ${token}`);
  }

  const hasTarget = options.user || options.repo !== undefined || options.target !== undefined;
  const hasMutationOption = options.force || options.dryRun || options.yes;
  const hasAgentOption = options.agents || options.allAgents;

  if ((command === "list" || command === "version" || command === "detect") && (hasTarget || hasMutationOption || hasAgentOption)) {
    throw new UsageError(`Target, agent, and mutation options are not valid for ${command}.`);
  }
  if (command === "doctor" && hasMutationOption) {
    throw new UsageError("Mutation options are not valid for doctor.");
  }
  if (command === "uninstall" && options.force) {
    throw new UsageError("--force is not valid for uninstall.");
  }
  if (options.allAgents && options.agents) {
    throw new UsageError("Use either --agents or --all-agents, not both.");
  }
  const selectorCount = [options.user, options.repo !== undefined, options.target !== undefined].filter(Boolean).length;
  if (selectorCount > 1) {
    throw new UsageError("Choose exactly one target selector: --user, --repo [path], or --target <skills-dir>.");
  }
  return options;
}

function hasExplicitTarget(options) {
  return options.user || options.repo !== undefined || options.target !== undefined;
}

function canRunGuidedInstall(options) {
  return (
    options.command === "install" &&
    !hasExplicitTarget(options) &&
    !options.agents &&
    !options.allAgents &&
    !options.yes &&
    !options.json &&
    supportsInteractiveUi()
  );
}

function needsInteractiveAgentPrompt(options) {
  if (!["install", "uninstall", "doctor"].includes(options.command)) return false;
  if (options.target !== undefined) return false;
  if (options.agents || options.allAgents) return false;
  if (options.yes || options.json) return false;
  return supportsInteractiveUi();
}

function usePrettyHumanOutput(options) {
  return !options.json && supportsInteractiveUi();
}

let options = { json: process.argv.includes("--json") };
try {
  options = parseArguments(process.argv.slice(2));
  if (!options.json && process.stdin.isTTY && process.stdout.isTTY) {
    options.confirm = async (message) => promptYesNo(message);
  }

  if (options.command === "help") {
    process.stdout.write(help);
  } else {
    const distribution = await loadDistribution();
    let result;
    let prettyHandled = false;

    if (options.command === "list") {
      result = { command: "list", skills: distribution.skills };
    } else if (options.command === "version") {
      result = { command: "version", version: distribution.version };
    } else if (options.command === "detect") {
      result = { command: "detect", agents: await detectAgents(distribution) };
      if (usePrettyHumanOutput(options)) {
        intro("Praxis Skills", { version: distribution.version });
        for (const agent of result.agents) {
          const mark = agent.detected ? `${c.green}detected${c.reset}` : `${c.gray}missing ${c.reset}`;
          process.stdout.write(
            `${S.bar}  ${mark}  ${c.bold}${agent.label.padEnd(12)}${c.reset}  ${c.dim}${agent.paths.userSkills}${c.reset}\n`,
          );
        }
        outro("Detection complete.", {
          hint: "Run: praxis-skills install",
        });
        prettyHandled = true;
      }
    } else if (canRunGuidedInstall(options)) {
      const detections = await detectAgents(distribution);
      const wizard = await runInstallWizard(distribution, detections, {
        dryRun: options.dryRun,
        slashCommands: options.slashCommands,
        tasteSkill: options.tasteSkill,
      });
      if (wizard.cancelled) {
        process.exitCode = 0;
        prettyHandled = true;
        result = { command: "install", cancelled: true };
      } else {
        if (wizard.scope === "user") options.user = true;
        if (wizard.scope === "repo") options.repo = wizard.repoPath || "";
        options.selectedAgents = wizard.selectedAgents;
        options.tasteSkill = Boolean(wizard.tasteSkill);
        // Wizard already confirmed — avoid a second y/N for force replaces unless --force without prior confirm path
        options.yes = true;
        const targets = await resolveInstallTargets(distribution, options);
        result = await installMany(distribution, targets, options);
        prettyHandled = printInstallExperience(result, { version: distribution.version });
      }
    } else {
      if (!hasExplicitTarget(options)) {
        throw new UsageError(
          "Choose a target: run `praxis-skills install` on a TTY, or pass --user / --repo [path] / --target <dir>.",
        );
      }

      if (needsInteractiveAgentPrompt(options)) {
        const detections = await detectAgents(distribution);
        options.selectedAgents = await promptAgentSelection(detections, {
          version: distribution.version,
        });
      }

      const targets = await resolveInstallTargets(distribution, options);
      if (options.command === "install") {
        result = await installMany(distribution, targets, options);
        if (usePrettyHumanOutput(options)) {
          prettyHandled = printInstallExperience(result, { version: distribution.version });
        }
      }
      if (options.command === "uninstall") {
        result = await uninstallMany(distribution, targets, options);
      }
      if (options.command === "doctor") {
        result = await doctorMany(distribution, targets);
        if (usePrettyHumanOutput(options)) {
          prettyHandled = printDoctorExperience(result);
        }
      }
    }

    if (!prettyHandled) printResult(result, options.json);
    if (options.command === "doctor" && result && !result.healthy) process.exitCode = 1;
  }
  // Interactive raw-mode prompts resume stdin; release it so the CLI process can exit.
  releaseStdin();
  if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode);
  process.exit(0);
} catch (error) {
  releaseStdin();
  if (options.json) printError(error, true);
  else if (supportsInteractiveUi()) printErrorPretty(error instanceof Error ? error.message : String(error));
  else printError(error, false);
  process.exit(error.exitCode ?? 1);
}
