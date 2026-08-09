import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("package metadata has no dependencies or lifecycle scripts", async () => {
  const packageJson = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
  assert.equal(packageJson.name, "praxis-skills");
  assert.equal(packageJson.version, "0.4.0-beta.6");
  assert.equal(packageJson.dependencies, undefined);
  for (const name of ["preinstall", "install", "postinstall", "prepublish", "prepublishOnly", "prepare"]) {
    assert.equal(packageJson.scripts[name], undefined, `unexpected lifecycle script: ${name}`);
  }
});

test("npm dry-run tarball contains only the intended distribution surface", () => {
  const npmCli = process.env.npm_execpath;
  const packed = npmCli
    ? spawnSync(process.execPath, [npmCli, "pack", "--dry-run", "--json"], {
        cwd: repoRoot,
        encoding: "utf8",
      })
    : spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  assert.equal(packed.status, 0, packed.stderr);
  const parsed = JSON.parse(packed.stdout);
  const metadata = Array.isArray(parsed)
    ? parsed[0]
    : parsed["praxis-skills"] ?? Object.values(parsed)[0];
  assert.ok(metadata, "npm pack returned no package metadata");
  const files = metadata.files.map((entry) => entry.path.replaceAll("\\", "/"));

  for (const required of [
    "package.json",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    "bin/praxis-skills.mjs",
    "lib/installer.mjs",
    "lib/output.mjs",
    "distribution/manifest.json",
    "plugin/.codex-plugin/plugin.json",
    "plugin/skills/praxis-init/SKILL.md",
  ]) {
    assert.ok(files.includes(required), `missing package file: ${required}`);
  }
  for (const forbiddenPrefix of [".git/", ".github/", ".praxis/", ".workflows/", ".agents/", "tests/"]) {
    assert.equal(files.some((file) => file.startsWith(forbiddenPrefix)), false, `unexpected package prefix: ${forbiddenPrefix}`);
  }
});
