import { afterEach, expect, it, vi } from "vitest";
import { fetchWithTimeout } from "../../src/lib/http";

afterEach(() => {
  vi.useRealTimers();
});

it("aborts a request that does not settle", async () => {
  vi.useFakeTimers();
  const fetchImpl: typeof fetch = vi.fn(
    (_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new Error("aborted")),
        );
      }),
  );

  const pending = fetchWithTimeout("https://example.com", {}, 50, fetchImpl);
  const rejection = expect(pending).rejects.toThrow("aborted");
  await vi.advanceTimersByTimeAsync(51);

  await rejection;
});

it("keeps the timeout active while the response body is being read", async () => {
  vi.useFakeTimers();
  const fetchImpl: typeof fetch = vi.fn(async (_input, init) => {
    const body = new ReadableStream({
      start(controller) {
        init?.signal?.addEventListener("abort", () =>
          controller.error(new Error("body aborted")),
        );
      },
    });
    return new Response(body, { status: 200 });
  });

  const pending = fetchWithTimeout("https://example.com", {}, 50, fetchImpl);
  const rejection = expect(pending).rejects.toThrow("body aborted");
  await vi.advanceTimersByTimeAsync(51);

  await rejection;
});
