import { measureClientBundle } from "./client-bundle-metrics.mjs";

const { clientApp, initialApplicationJs, chunks } = await measureClientBundle();
console.log(JSON.stringify({ clientApp, initialApplicationJs, chunks }, null, 2));
