import type { Plan, PlanName } from "@/lib/types";

/**
 * The commercial model stations subscribe to.
 *
 * `features` lists what a plan includes today. `planned` lists what the plan
 * will add next, so the pricing pages never present an upcoming capability as
 * already included.
 */

export const PLAN_PERKS: Record<PlanName, string> = {
  starter: "For small refill businesses starting their online presence.",
  growth: "For growing refill businesses ready to scale.",
  pro: "For established businesses with multiple branches.",
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small refill businesses starting online.",
    monthlyPrice: 1500,
    annualPrice: 15000,
    trialDays: 14,
    features: [
      "Online business profile",
      "Product catalog - up to 25 products",
      "Order management with status updates",
      "Customer list with order history",
      "Sales reports from your own orders",
      "M-Pesa checkout",
    ],
    planned: ["Card payments", "Recurring orders"],
    cta: "Start free trial",
    audience: "1 branch · 1 owner",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing refill businesses ready to scale.",
    monthlyPrice: 4500,
    annualPrice: 45000,
    trialDays: 14,
    highlighted: true,
    features: [
      "Everything in Starter",
      "Advanced analytics and sales charts",
      "Promotions dashboard",
      "Repeat-rate and customer insights",
      "Low-stock alerts",
    ],
    planned: [
      "Staff accounts - up to 5",
      "Customer SMS & WhatsApp notifications",
      "Priority listing in search",
      "Repeat-order reminders",
    ],
    cta: "Start free trial",
    audience: "2 branches · 5 staff",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For established businesses with multiple branches.",
    monthlyPrice: 12000,
    annualPrice: 120000,
    trialDays: 14,
    features: ["Everything in Growth", "Full analytics and customer insights"],
    planned: [
      "Custom branding & domain",
      "Loyalty and retention tools",
      "Unlimited staff accounts",
      "Multiple branches & fleets",
      "Priority support - WhatsApp line",
      "Dedicated account manager",
    ],
    cta: "Start free trial",
    audience: "Unlimited branches",
  },
];

export function getPlan(id: PlanName): Plan {
  return plans.find((p) => p.id === id) ?? plans[1];
}

/** Annual pricing as a single payment - displayed as "billed annually" in KES. */
export function annualBilled(plan: Plan) {
  return plan.annualPrice;
}
