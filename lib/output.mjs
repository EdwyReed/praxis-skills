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
  if (result.command === "doctor") {
    process.stdout.write(`${result.healthy ? "Healthy" : "Unhealthy"}: ${result.target}\n`);
    for (const check of result.checks.filter((item) => !item.healthy)) {
      process.stdout.write(`MISSING ${check.name}/SKILL.md\n`);
    }
    return;
  }
  const prefix = result.dryRun ? "DRY RUN " : "";
  process.stdout.write(`${prefix}${result.command} target: ${result.target}\n`);
  for (const action of result.actions) process.stdout.write(`${action.type.toUpperCase()} ${action.name}\n`);
}

export function printError(error, json) {
  const message = error instanceof Error ? error.message : String(error);
  if (json) process.stderr.write(`${JSON.stringify({ error: message })}\n`);
  else process.stderr.write(`Error: ${message}\n`);
}
