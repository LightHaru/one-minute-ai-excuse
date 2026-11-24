import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const mainTs = fileURLToPath(new URL("./main.ts", import.meta.url));

test("writes a deterministic, strictly one-line entry to <dir>/entry.txt", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "entry-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const run = () => execFileSync(process.execPath, [mainTs, dir]);

  run();
  const outPath = join(dir, "entry.txt");
  assert.ok(existsSync(outPath), "entry.txt was not written to the given directory");
  const first = readFileSync(outPath, "utf8");

  run();
  const second = readFileSync(outPath, "utf8");

  assert.equal(second, first, "output is not deterministic");
  assert.ok(first.trim().length > 0, "entry is blank");
  assert.ok([...first].length <= 200, "entry exceeds 200 Unicode characters");
  assert.ok(!first.includes("\n") && !first.includes("\r"), "entry is not exactly one line");
  assert.match(first, /deadline/i, "missed deadline is not mentioned");
});
