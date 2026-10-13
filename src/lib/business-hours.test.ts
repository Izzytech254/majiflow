import { describe, expect, it } from "vitest";
import {
  getBusinessAvailability,
  getBusinessOrderBlockReason,
  weeklyHoursGrid,
} from "@/lib/business-hours";
import { businesses } from "@/lib/data/businesses";
import type { WeeklyOperatingHours } from "@/lib/types";

/**
 * Hours are read in Africa/Nairobi (UTC+3, no daylight saving), so every
 * instant below is written in UTC with the local time named in a comment.
 */

const OFFICE: WeeklyOperatingHours = {
  monday: { open: "06:00", close: "20:00" },
  tuesday: { open: "06:00", close: "20:00" },
  wednesday: { open: "06:00", close: "20:00" },
  thursday: { open: "06:00", close: "20:00" },
  friday: { open: "06:00", close: "20:00" },
  saturday: { open: "08:00", close: "18:00" },
  sunday: null,
};

const OVERNIGHT: WeeklyOperatingHours = {
  ...OFFICE,
  tuesday: { open: "20:00", close: "02:00" },
};

describe("getBusinessAvailability", () => {
  it("is open inside a published window", () => {
    // Mon 10:00 Nairobi
    expect(getBusinessAvailability(OFFICE, new Date("2026-09-21T07:00:00Z")).state).toBe("open");
  });

  it("is closed after the window ends", () => {
    // Mon 21:00 Nairobi
    expect(getBusinessAvailability(OFFICE, new Date("2026-09-21T18:00:00Z")).state).toBe("closed");
  });

  it("treats a null day as closed", () => {
    // Sun 11:00 Nairobi
    expect(getBusinessAvailability(OFFICE, new Date("2026-09-20T08:00:00Z")).state).toBe("closed");
  });

  it("handles an overnight window after midnight", () => {
    // Tue 01:00 Nairobi, inside Monday 20:00 -> 02:00
    const availability = getBusinessAvailability(OVERNIGHT, new Date("2026-09-21T22:00:00Z"));
    expect(availability.state).toBe("open");
    expect(availability.hoursLabel).toContain("overnight");
  });

  it("closes an overnight window once it is past the close time", () => {
    // Tue 03:00 Nairobi, past Monday's 02:00 close
    expect(getBusinessAvailability(OVERNIGHT, new Date("2026-09-22T00:00:00Z")).state).toBe("closed");
  });

  it("reports unknown when no schedule is published", () => {
    expect(getBusinessAvailability(undefined, new Date("2026-09-21T07:00:00Z")).state).toBe("unknown");
  });

  it("treats a zero-length window as unpublished rather than always-open", () => {
    const broken: WeeklyOperatingHours = { ...OFFICE, monday: { open: "09:00", close: "09:00" } };
    // Mon 09:00 Nairobi
    expect(getBusinessAvailability(broken, new Date("2026-09-21T06:00:00Z")).state).toBe("unknown");
  });
});

describe("getBusinessOrderBlockReason", () => {
  it("blocks an order when the station is closed", () => {
    // Mon 21:00 Nairobi
    expect(getBusinessOrderBlockReason({ openingHours: OFFICE }, new Date("2026-09-21T18:00:00Z"))).toMatch(
      /closed/i
    );
  });

  it("blocks an order when hours are unpublished", () => {
    expect(getBusinessOrderBlockReason({}, new Date("2026-09-21T07:00:00Z"))).toMatch(/unavailable/i);
  });

  it("allows an order inside the window", () => {
    expect(getBusinessOrderBlockReason({ openingHours: OFFICE }, new Date("2026-09-21T07:00:00Z"))).toBeNull();
  });
});

describe("the station catalogue", () => {
  it.each(businesses.map((b) => [b.id, b] as const))(
    "publishes hours for %s so checkout can accept an order",
    (_id, business) => {
      expect(business.openingHours, `${business.id} has no openingHours`).toBeTruthy();
    }
  );

  it("has at least one moment each station is open", () => {
    for (const business of businesses) {
      const midday = new Date("2026-09-21T09:00:00Z"); // Mon 12:00 Nairobi
      expect(
        getBusinessAvailability(business.openingHours, midday).state,
        `${business.id} is never open on a Monday midday`
      ).toBe("open");
    }
  });
});

describe("weeklyHoursGrid", () => {
  it("returns seven rows starting on Monday", () => {
    const rows = weeklyHoursGrid(OFFICE);
    expect(rows.map((r) => r.short)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    expect(rows[6].label).toBe("Closed");
  });

  it("marks unpublished days distinctly from closed days", () => {
    const rows = weeklyHoursGrid({ monday: { open: "06:00", close: "20:00" } });
    expect(rows[0].label).not.toBe("Closed");
    expect(rows[1].label).toBe("Not published");
  });
});
