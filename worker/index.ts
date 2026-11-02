/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { runWithDatabase } from "../db/runtime-env";
import {
  runWithEnvironment,
  type FoposRuntimeEnvironment,
} from "../app/core/runtime-environment";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  // Kendi Workers dağıtımımızın oturum yönetimi. Sites dağıtımında
  // tanımlı değildir; kimlik o zaman başlıklardan okunur.
  FOPOS_ACCESS_CODE?: string;
  FOPOS_SESSION_SECRET?: string;
  FOPOS_TEACHER_EMAIL?: string;
  FOPOS_TEACHER_NAME?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const environment: FoposRuntimeEnvironment = {
      FOPOS_ACCESS_CODE: env.FOPOS_ACCESS_CODE,
      FOPOS_SESSION_SECRET: env.FOPOS_SESSION_SECRET,
      FOPOS_TEACHER_EMAIL: env.FOPOS_TEACHER_EMAIL,
      FOPOS_TEACHER_NAME: env.FOPOS_TEACHER_NAME,
    };

    return runWithEnvironment(environment, () =>
      runWithDatabase(env.DB, () => handler.fetch(request, env, ctx)),
    );
  },
};

export default worker;
