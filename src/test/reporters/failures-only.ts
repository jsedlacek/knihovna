import type { TestEvent } from "node:test/reporters";

const failures: { name: string; error: string }[] = [];
let passed = 0;
let failed = 0;

export default async function* failuresOnly(source: AsyncIterable<TestEvent>) {
  for await (const event of source) {
    if (event.type === "test:pass" && event.data.details?.type !== "suite") {
      passed++;
    }
    if (event.type === "test:fail" && event.data.details?.type !== "suite") {
      failed++;
      const name = event.data.name;
      const error =
        event.data.details?.error instanceof Error
          ? (event.data.details.error.stack ?? event.data.details.error.message)
          : String(event.data.details?.error ?? "Unknown error");
      failures.push({ name, error });
    }
  }

  if (failures.length > 0) {
    yield "\n";
    for (const { name, error } of failures) {
      yield `\u2717 ${name}\n${error}\n\n`;
    }
  }

  const total = passed + failed;
  if (failed > 0) {
    yield `${failed} of ${total} tests failed\n`;
  } else {
    yield `${total} tests passed\n`;
  }
}
