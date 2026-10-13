import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildAlert, notifyStatusChange, reportFailure } from "@/lib/monitoring";

let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  delete process.env.MF_ALERT_WEBHOOK_URL;
  delete process.env.MF_NOTIFY_WEBHOOK_URL;
});

afterEach(() => {
  errorSpy.mockRestore();
  vi.unstubAllGlobals();
  delete process.env.MF_ALERT_WEBHOOK_URL;
  delete process.env.MF_NOTIFY_WEBHOOK_URL;
});

describe("buildAlert", () => {
  it("redacts personal details", () => {
    const alert = buildAlert("order", "boom", {
      orderId: "o1",
      customerPhone: "0712345678",
      token: "secret",
      nested: { email: "jane@example.com" },
    });
    expect(alert.detail?.customerPhone).toBe("[redacted]");
    expect(alert.detail?.token).toBe("[redacted]");
    expect((alert.detail?.nested as Record<string, unknown>).email).toBe("[redacted]");
    expect(alert.detail?.orderId).toBe("o1");
  });

  it("stamps the time it was built", () => {
    const alert = buildAlert("payment", "failed", undefined, new Date("2026-09-21T10:00:00Z"));
    expect(alert.at).toBe("2026-09-21T10:00:00.000Z");
  });
});

describe("reportFailure", () => {
  it("logs without any configuration", async () => {
    await expect(reportFailure("order", "no webhook")).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalledOnce();
  });

  it("posts to the alert webhook when configured", async () => {
    process.env.MF_ALERT_WEBHOOK_URL = "https://alerts.example/hook";
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);

    await reportFailure("payment", "card declined", { orderId: "o1" });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.kind).toBe("payment");
    expect(body.detail.orderId).toBe("o1");
  });

  it("stays resolved when the webhook itself is down", async () => {
    process.env.MF_ALERT_WEBHOOK_URL = "https://alerts.example/hook";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    await expect(reportFailure("order", "still fine")).resolves.toBeUndefined();
  });
});

describe("notifyStatusChange", () => {
  it("sends through the provider when configured", async () => {
    process.env.MF_NOTIFY_WEBHOOK_URL = "https://sms.example/send";
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await notifyStatusChange({ id: "o1", status: "accepted" }, "0712345678");
    expect(result.sent).toBe(true);
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.to).toBe("0712345678");
  });

  it("reports when the provider rejects a message", async () => {
    process.env.MF_NOTIFY_WEBHOOK_URL = "https://sms.example/send";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 502 })));

    const result = await notifyStatusChange({ id: "o1", status: "accepted" }, "0712345678");
    expect(result.sent).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("reports the missing provider instead of pretending to send", async () => {
    const result = await notifyStatusChange({ id: "o1", status: "accepted" }, "0712345678");
    expect(result.sent).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
  });
});
