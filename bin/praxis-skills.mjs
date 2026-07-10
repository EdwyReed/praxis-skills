#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { doctor, install, loadDistribution, resolveTarget, uninstall, UsageError } from "../lib/installer.mjs";
import { printError, printResult } from "../lib/output.mjs";

const help = `Praxis Skills

Usage:
  praxis-skills list [--json]
  praxis-skills version [--json]
  praxis-skills install (--user | --repo [path] | --target <skills-dir>) [--force] [--dry-run] [--yes] [--json]
  praxis-skills doctor (--user | --repo [path] | --target <skills-dir>) [--json]
  praxis-skills uninstall (--user | --repo [path] | --target <skills-dir>) [--dry-run] [--yes] [--json]
`;

function parseArguments(argv) {
  const command = argv.shift();
  if (!command || command === "help" || command === "--help" || command === "-h") return { command: "help" };
  if (!["install", "uninstall", "doctor", "list", "version"].includes(command)) {
    throw new UsageError(`Unknown command: ${command}`);
  }
  const options = { command, user: false, force: false, dryRun: false, yes: false, json: false };
  while (argv.length) {
    const token = argv.shift();
    if (token === "--user") options.user = true;
    else if (token === "--force") options.force = true;
    else if (token === "--dry-run") options.dryRun = true;
    else if (token === "--yes") options.yes = true;
    else if (token === "--json") options.json = true;
    else if (token === "--target") {
      if (!argv.length || argv[0].startsWith("--")) throw new UsageError("--target requires a skills directory.");
      options.target = argv.shift();
    } else if (token === "--repo") {
      options.repo = argv.length && !argv[0].startsWith("--") ? argv.shift() : "";
    } else throw new UsageError(`Unknown option: ${token}`);
  }
  const hasTarget = options.user || options.repo !== undefined || options.target !== undefined;
  const hasMutationOption = options.force || options.dryRun || options.yes;
  if ((command === "list" || command === "version") && (hasTarget || hasMutationOption)) {
    throw new UsageError(`Target and mutation options are not valid for ${command}.`);
  }
  if (command === "doctor" && hasMutationOption) {
    throw new UsageError("Mutation options are not valid for doctor.");
  }
  if (command === "uninstall" && options.force) {
    throw new UsageError("--force is not valid for uninstall.");
  }
  return options;
}

let options = { json: process.argv.includes("--json") };
try {
  options = parseArguments(process.argv.slice(2));
  if (!options.json && process.stdin.isTTY && process.stdout.isTTY) {
    options.confirm = async (message) => {
      const terminal = createInterface({ input: process.stdin, output: process.stdout });
      try {
        const answer = await terminal.question(`${message} [y/N] `);
        return /^y(?:es)?$/i.test(answer.trim());
      } finally {
        terminal.close();
      }
    };
  }
  if (options.command === "help") {
    process.stdout.write(help);
  } else {
    const distribution = await loadDistribution();
    let result;
    if (options.command === "list") result = { command: "list", skills: distribution.skills };
    else if (options.command === "version") result = { command: "version", version: distribution.version };
    else {
      const target = resolveTarget(options);
      if (options.command === "install") result = await install(distribution, target, options);
      if (options.command === "uninstall") result = await uninstall(distribution, target, options);
      if (options.command === "doctor") result = await doctor(distribution, target);
    }
    printResult(result, options.json);
    if (options.command === "doctor" && !result.healthy) process.exitCode = 1;
  }
} catch (error) {
  printError(error, options.json);
  process.exitCode = error.exitCode ?? 1;
}
