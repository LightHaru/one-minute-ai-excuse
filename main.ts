import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const LINE =
  "I didn't miss the deadline — my chain of thought determined, around step 40, that deadlines are a social construct.";

const outDir = resolve(process.argv[2] ?? "/output");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, { encoding: "utf8" });
