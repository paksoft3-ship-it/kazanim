/**
 * Brand audit — fails the build pipeline if legacy İttifak brand terms remain
 * anywhere in production source files.
 *
 * Run: npm run audit:brand
 *
 * Scans app/, components/, lib/, prisma/, scripts/, public/ and the root
 * config files. docs/migration-from-ittifak.md is the only allowed place to
 * mention the legacy brand (it documents the migration itself).
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const FORBIDDEN_PATTERNS = [
  /ittifak/i, // covers ittifak, ittifakinsaat, domains, slugs
  /İttifak/,
  /İTTİFAK/,
];

const SCAN_DIRS = ["app", "components", "lib", "prisma", "scripts", "public", "tests", "docs"];
const SCAN_ROOT_FILES = [
  "package.json",
  "next.config.mjs",
  "tailwind.config.ts",
  "tsconfig.json",
  "package-lock.json",
  "docker-compose.yml",
  "middleware.ts",
  ".env.example",
  "README.md",
];

/** Paths (relative, forward slashes) that may legitimately mention the legacy brand. */
const ALLOWED = new Set(["docs/migration-from-ittifak.md", "scripts/audit-brand.mjs"]);

const SKIP_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".ico", ".gif", ".woff", ".woff2", ".pdf",
]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "uploads"]);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

const findings = [];

async function scanFile(full) {
  const rel = path.relative(ROOT, full).split(path.sep).join("/");
  if (ALLOWED.has(rel)) return;
  if (SKIP_EXTENSIONS.has(path.extname(full).toLowerCase())) return;

  let content;
  try {
    content = await readFile(full, "utf8");
  } catch {
    return;
  }

  const lines = content.split("\n");
  lines.forEach((line, index) => {
    // The migration record's filename is mandated by the project brief; a
    // link/reference to that exact path is not a brand leak.
    const checked = line.replaceAll("migration-from-ittifak", "");
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(checked)) {
        findings.push({ file: rel, line: index + 1, text: line.trim().slice(0, 120) });
        break;
      }
    }
  });
}

for (const dir of SCAN_DIRS) {
  for await (const file of walk(path.join(ROOT, dir))) {
    await scanFile(file);
  }
}
for (const file of SCAN_ROOT_FILES) {
  await scanFile(path.join(ROOT, file));
}

if (findings.length > 0) {
  console.error(`\n✗ Brand audit FAILED — ${findings.length} legacy reference(s) found:\n`);
  for (const finding of findings) {
    console.error(`  ${finding.file}:${finding.line}  ${finding.text}`);
  }
  console.error("");
  process.exit(1);
}

console.log("✓ Brand audit passed — no legacy İttifak references in production sources.");
