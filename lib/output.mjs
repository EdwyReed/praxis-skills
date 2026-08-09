export function printResult(result, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return;
  }
  if (result.command === "list") {
    process.stdout.write(`${result.skills.join("\n")}\n`);
    return;
  }
  if (result.command === "version") {
    process.stdout.write(`${result.version}\n`);
    return;
  }
  if (result.command === "detect") {
    for (const agent of result.agents) {
      const mark = agent.detected ? "DETECTED" : "missing ";
      process.stdout.write(`${mark}  ${agent.id.padEnd(12)} ${agent.paths.userSkills}\n`);
    }
    return;
  }
  if (result.command === "doctor") {
    if (result.targets) {
      process.stdout.write(`${result.healthy ? "Healthy" : "Unhealthy"} multi-target doctor\n`);
      for (const target of result.targets) {
        process.stdout.write(
          `  ${target.healthy ? "OK" : "BAD"} ${target.agent}: skills ${target.target}${target.commandsTarget ? `; commands ${target.commandsTarget}` : ""}\n`,
        );
        for (const check of target.checks.filter((item) => !item.healthy)) {
          process.stdout.write(`    MISSING ${check.kind} ${check.name}\n`);
        }
      }
      return;
    }
    process.stdout.write(`${result.healthy ? "Healthy" : "Unhealthy"}: ${result.target}\n`);
    for (const check of result.checks.filter((item) => !item.healthy)) {
      process.stdout.write(`MISSING ${check.kind || "skill"} ${check.name}\n`);
    }
    return;
  }

  // Multi-target install/uninstall
  if (result.targets) {
    const prefix = result.dryRun ? "DRY RUN " : "";
    process.stdout.write(`${prefix}${result.command} (${result.targets.length} target(s))\n`);
    for (const target of result.targets) {
      process.stdout.write(
        `  ${target.agent}: ${target.target}${target.commandsTarget ? ` + ${target.commandsTarget}` : ""}\n`,
      );
      for (const action of target.actions) {
        process.stdout.write(`    ${action.type.toUpperCase()} ${action.name}\n`);
      }
    }
    return;
  }

  const prefix = result.dryRun ? "DRY RUN " : "";
  process.stdout.write(
    `${prefix}${result.command} ${result.agent ? `[${result.agent}] ` : ""}target: ${result.target}\n`,
  );
  for (const action of result.actions) process.stdout.write(`${action.type.toUpperCase()} ${action.name}\n`);
}

export function printError(error, json) {
  const message = error instanceof Error ? error.message : String(error);
  if (json) process.stderr.write(`${JSON.stringify({ error: message })}\n`);
  else process.stderr.write(`Error: ${message}\n`);
}
