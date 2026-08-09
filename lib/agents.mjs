import { homedir } from "node:os";
import path from "node:path";
import { stat } from "node:fs/promises";

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function joinHome(...parts) {
  return path.join(homedir(), ...parts);
}

function joinRepo(repoRoot, parts) {
  return path.join(repoRoot, ...parts);
}

/**
 * Detect which known coding agents appear installed on this machine.
 * Detection is filesystem-home based (cheap and cross-platform).
 */
export async function detectAgents(distribution) {
  const results = [];
  for (const agent of distribution.agents) {
    const homes = [];
    let detected = false;
    for (const homeName of agent.detectHomes) {
      const homePath = joinHome(homeName);
      const present = await exists(homePath);
      homes.push({ path: homePath, present });
      if (present) detected = true;
    }
    results.push({
      id: agent.id,
      label: agent.label,
      description: agent.description,
      detected,
      defaultSelected: Boolean(agent.defaultSelected),
      slashCommands: Boolean(agent.slashCommands),
      homes,
      paths: {
        userSkills: joinHome(...agent.userSkillsRel),
        userCommands: agent.userCommandsRel ? joinHome(...agent.userCommandsRel) : null,
        userReceiptRoot: joinHome(...agent.userReceiptRel),
      },
    });
  }
  return results;
}

export function getAgentDefinition(distribution, agentId) {
  const agent = distribution.agents.find((entry) => entry.id === agentId);
  if (!agent) throw new Error(`Unknown agent: ${agentId}`);
  return agent;
}

/**
 * Resolve one concrete install destination for an agent + scope.
 * scope: "user" | "repo"
 */
export function resolveAgentTarget(distribution, agentId, scope, repoRoot = process.cwd()) {
  const agent = getAgentDefinition(distribution, agentId);
  if (scope === "user") {
    return {
      agent: agent.id,
      label: agent.label,
      kind: "user",
      skillsRoot: joinHome(...agent.userSkillsRel),
      commandsRoot: agent.userCommandsRel ? joinHome(...agent.userCommandsRel) : null,
      agentsRoot: joinHome(...agent.userReceiptRel),
      slashCommands: Boolean(agent.slashCommands),
    };
  }
  if (scope === "repo") {
    const root = path.resolve(repoRoot);
    return {
      agent: agent.id,
      label: agent.label,
      kind: "repo",
      skillsRoot: joinRepo(root, agent.repoSkillsRel),
      commandsRoot: agent.repoCommandsRel ? joinRepo(root, agent.repoCommandsRel) : null,
      agentsRoot: joinRepo(root, agent.repoReceiptRel),
      slashCommands: Boolean(agent.slashCommands),
    };
  }
  throw new Error(`Unknown scope: ${scope}`);
}

export function parseAgentList(value, distribution) {
  if (!value || value === "all") {
    return distribution.agents.map((agent) => agent.id);
  }
  const known = new Set(distribution.agents.map((agent) => agent.id));
  const ids = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!ids.length) throw new Error("Agent list is empty.");
  for (const id of ids) {
    if (!known.has(id)) {
      throw new Error(`Unknown agent '${id}'. Known: ${[...known].join(", ")}`);
    }
  }
  return [...new Set(ids)];
}
