const filter = process.argv[2]?.toLowerCase();

const res = await fetch("http://localhost:6006/index.json");
if (!res.ok) {
  console.error("Storybook is not running. Start it with: pnpm storybook --no-open");
  process.exit(1);
}

const data = (await res.json()) as { entries: Record<string, { id: string }> };

for (const { id } of Object.values(data.entries)) {
  if (filter && !id.includes(filter)) continue;
  console.log(id);
}
