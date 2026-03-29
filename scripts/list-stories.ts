import { readFileSync, globSync } from "node:fs";

const filter = process.argv[2]?.toLowerCase();

const files = globSync("src/**/*.stories.tsx").sort();

for (const file of files) {
  const content = readFileSync(file, "utf-8");

  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  if (!titleMatch) continue;
  const title = titleMatch[1];

  const storyPrefix = title.replace(/\//g, "-").toLowerCase().replace(/\s+/g, "-");

  const exportMatches = content.matchAll(/^export\s+(?:const|function)\s+(\w+)/gm);
  for (const m of exportMatches) {
    const name = m[1];
    if (name === "default") continue;

    const storyName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const id = `${storyPrefix}--${storyName}`;

    if (filter && !id.includes(filter) && !title.toLowerCase().includes(filter)) continue;

    console.log(id);
  }
}
