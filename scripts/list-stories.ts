import { ensureStorybook, STORYBOOK_BASE } from "./ensure-storybook.ts";

const filter = process.argv[2]?.toLowerCase();

await ensureStorybook();

const res = await fetch(`${STORYBOOK_BASE}/index.json`);
const data = (await res.json()) as { entries: Record<string, { id: string }> };

for (const { id } of Object.values(data.entries)) {
  if (filter && !id.includes(filter)) continue;
  console.log(id);
}
