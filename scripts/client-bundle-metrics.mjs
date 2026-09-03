import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

export async function measureClientBundle(
  manifestPath = new URL("../dist/client/.vite/manifest.json", import.meta.url),
) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const roots = ["virtual:vinext-app-browser-entry", "app/ClientApp.tsx"];
  const included = new Set();

  function includeStaticImports(key) {
    if (included.has(key)) return;
    const item = manifest[key];
    if (!item) throw new Error(`Üretim manifestinde ${key} bulunamadı.`);
    included.add(key);
    for (const dependency of item.imports ?? []) includeStaticImports(dependency);
  }

  for (const root of roots) includeStaticImports(root);

  const chunks = [];
  for (const key of included) {
    const file = manifest[key].file;
    if (!file.endsWith(".js")) continue;
    const source = await readFile(new URL(`../dist/client/${file}`, import.meta.url));
    chunks.push({
      key,
      file,
      rawBytes: source.byteLength,
      gzipBytes: gzipSync(source).byteLength,
    });
  }

  chunks.sort((left, right) => right.rawBytes - left.rawBytes);
  const initialApplicationJs = chunks.reduce(
    (sum, chunk) => ({
      rawBytes: sum.rawBytes + chunk.rawBytes,
      gzipBytes: sum.gzipBytes + chunk.gzipBytes,
    }),
    { rawBytes: 0, gzipBytes: 0 },
  );

  return {
    manifest,
    clientApp: chunks.find((chunk) => chunk.key === "app/ClientApp.tsx"),
    initialApplicationJs,
    chunks,
  };
}
