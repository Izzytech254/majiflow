import type { Faq } from "@/lib/types";

export const faqs: Faq[] = [
  {
    id: "f1",
    group: "customers",
    question: "How do I order water?",
    answer:
      "Choose your location, pick a refill station near you, add cans or bottles to your cart, pay with M-Pesa, and track the order until the rider knocks at your door.",
  },
  {
    id: "f2",
    group: "customers",
    question: "What does delivery cost?",
    answer:
      "Delivery fees are set by each refill business and shown on the business page before you order. Most stations in Nairobi and Mombasa charge between KES 100 and KES 200 — and many give free delivery on orders above a minimum, usually KES 1,000.",
  },
  {
    id: "f3",
    group: "customers",
    question: "Can I pay with M-Pesa?",
    answer:
      "Yes. Choose M-Pesa at checkout and confirm the STK push on your phone. Card payments are also available at stations that have enabled them.",
  },
  {
    id: "f4",
    group: "customers",
    question: "How do I manage my subscription for regular delivery?",
    answer:
      "On the order confirmation page, choose how often you want regular refills — daily, weekly or two-weekly. We schedule, remind you, and you can pause anytime from your dashboard.",
  },
  {
    id: "f5",
    group: "customers",
    question: "What if the water doesn't arrive?",
    answer:
      "Every order is live-tracked. If anything goes wrong, the business's support number is one tap away, and MajiFlow's help desk will step in if the order isn't resolved.",
  },
  {
    id: "f6",
    group: "businesses",
    question: "How do I register my refill business?",
    answer:
      "Start a 14-day free trial, add your business details, set your delivery areas and fees, list your products in KES, and go live. Most stations are online within an hour.",
  },
  {
    id: "f7",
    group: "businesses",
    question: "How do I get paid for orders?",
    answer:
      "Customers pay with M-Pesa or card before delivery. Funds settle into your M-Pesa till or Paybill directly. Your dashboard shows every payment, automatically reconciled against orders.",
  },
  {
    id: "f8",
    group: "businesses",
    question: "Can I cancel my subscription?",
    answer:
      "Anytime, from Billing settings. Your business profile stays live until the end of the billing period, and you can export all of your data.",
  },
  {
    id: "f9",
    group: "billing",
    question: "Is there a free trial?",
    answer:
      "Every plan includes a 14-day free trial with no card required. You only choose a plan when you're ready to stay online.",
  },
  {
    id: "f10",
    group: "billing",
    question: "Are there setup or commission fees?",
    answer:
      "No setup fees and no commission on orders. You pay a flat monthly or annual SaaS fee. The sale price you set is the price you keep.",
  },
];

export function faqsByGroup(group: Faq["group"]) {
  return faqs.filter((f) => f.group === group);
}