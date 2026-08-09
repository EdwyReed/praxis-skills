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
import { promptAgentSelection, promptYesNo } from "../lib/prompt.mjs";

const help = `Praxis Skills

Usage:
  praxis-skills list [--json]
  praxis-skills version [--json]
  praxis-skills detect [--json]
  praxis-skills install (--user | --repo [path] | --target <skills-dir>)
                        [--agents <id,id|all>] [--all-agents]
                        [--with-slash-commands | --no-slash-commands]
                        [--commands-target <dir>]
                        [--force] [--dry-run] [--yes] [--json]
  praxis-skills doctor (--user | --repo [path] | --target <skills-dir>)
                       [--agents <id,id|all>] [--all-agents] [--json]
  praxis-skills uninstall (--user | --repo [path] | --target <skills-dir>)
                          [--agents <id,id|all>] [--all-agents]
                          [--dry-run] [--yes] [--json]

Agents:
  codex         ~/.agents/skills  (Codex skill discovery; default)
  claude-code   ~/.claude/skills + ~/.claude/commands  (skills + slash adapters)
  cursor        ~/.cursor/skills
  grok          ~/.grok/skills

Notes:
  - Interactive install (TTY, no --agents/--yes/--json) asks which detected agents to target.
  - Non-interactive default without --agents is Codex only (backward compatible).
  - Slash commands are thin adapters that load the matching Praxis skill. Codex keeps skill invocation.
  - Existing targets are skipped unless --force (with confirmation or --yes).
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
  return options;
}

function needsInteractiveAgentPrompt(options) {
  if (!["install", "uninstall", "doctor"].includes(options.command)) return false;
  if (options.target !== undefined) return false;
  if (options.agents || options.allAgents) return false;
  if (options.yes || options.json) return false;
  return process.stdin.isTTY && process.stdout.isTTY;
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

    if (options.command === "list") {
      result = { command: "list", skills: distribution.skills };
    } else if (options.command === "version") {
      result = { command: "version", version: distribution.version };
    } else if (options.command === "detect") {
      result = { command: "detect", agents: await detectAgents(distribution) };
    } else {
      const selectors = [options.user, options.repo !== undefined, options.target !== undefined].filter(Boolean);
      if (selectors.length !== 1) {
        throw new UsageError("Choose exactly one target selector: --user, --repo [path], or --target <skills-dir>.");
      }

      if (needsInteractiveAgentPrompt(options)) {
        const detections = await detectAgents(distribution);
        options.selectedAgents = await promptAgentSelection(detections);
      }

      const targets = await resolveInstallTargets(distribution, options);
      if (options.command === "install") result = await installMany(distribution, targets, options);
      if (options.command === "uninstall") result = await uninstallMany(distribution, targets, options);
      if (options.command === "doctor") result = await doctorMany(distribution, targets);
    }

    printResult(result, options.json);
    if (options.command === "doctor" && !result.healthy) process.exitCode = 1;
  }
} catch (error) {
  printError(error, options.json);
  process.exitCode = error.exitCode ?? 1;
}
