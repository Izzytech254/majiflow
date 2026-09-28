import type { DashboardStats, CustomerRecord, Testimonial } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I set up my station on MajiFlow on a Monday lunch break. By Friday we had 40 online orders. The dashboard is so simple my brother runs it.",
    name: "Grace Mwangi",
    role: "Owner, BioWater Refill Station",
    location: "Kasarani, Nairobi",
    initials: "GM",
  },
  {
    id: "t2",
    quote:
      "Customers pay with M-Pesa before the rider even starts the bike. No cash, no 'I'll send it later'. Our outstanding balance died in a month.",
    name: "Keith Otieno",
    role: "Operations, TruFlow Waters",
    location: "Nyali, Mombasa",
    initials: "KO",
  },
  {
    id: "t3",
    quote:
      "As a customer, I open the app at work, order two cans, and the rider calls when he's at the gate. My family has not carried a can down a flight of stairs in a year.",
    name: "Sharon Achieng",
    role: "Apartment resident",
    location: "Milimani, Kisumu",
    initials: "SA",
  },
  {
    id: "t4",
    quote:
      "The starter plan paid for itself with the first three office contracts we onboarded. The repeat-order reminders are gold for retention.",
    name: "David Kimani",
    role: "Co-founder, PureBlue Refills",
    location: "Nakuru",
    initials: "DK",
  },
  {
    id: "t5",
    quote:
      "Promotions on Growth let me push my chilled 10L bottles to offices in Nyali. Revenue is up 34% since we started running them.",
    name: "Fatuma Ali",
    role: "MD, TruFlow Waters",
    location: "Bamburi, Mombasa",
    initials: "FA",
  },
  {
    id: "t6",
    quote:
      "Reports used to live in a notebook. Now I see popular products, repeat customers and stock alerts in one screen before chai.",
    name: "Peter Nyongesa",
    role: "Owner, Highlands Aqua",
    location: "Eldoret",
    initials: "PN",
  },
];

export const customerRecords: CustomerRecord[] = [
  { id: "c1", name: "Jane Wanjiku", phone: "+254 712 345 678", location: "Kasarani, Nairobi", orders: 18, totalSpent: 12100, lastOrder: "Today", status: "active" },
  { id: "c2", name: "Omondi Ochieng", phone: "+254 722 111 222", location: "Pipeline, Nairobi", orders: 9, totalSpent: 6100, lastOrder: "2 days ago", status: "active" },
  { id: "c3", name: "Amina Yusuf", phone: "+254 733 444 555", location: "Nyali, Mombasa", orders: 4, totalSpent: 2600, lastOrder: "5 days ago", status: "new" },
  { id: "c4", name: "Stephen Gachiri", phone: "+254 701 909 808", location: "Elgon View, Eldoret", orders: 22, totalSpent: 15800, lastOrder: "Today", status: "active" },
  { id: "c5", name: "Lilian Koech", phone: "+254 755 626 414", location: "Milimani, Nakuru", orders: 2, totalSpent: 900, lastOrder: "3 weeks ago", status: "dormant" },
];

export const dashboardStats: DashboardStats = {
  revenueToday: 48250,
  revenueTrend: 12.4,
  ordersToday: 34,
  pendingOrders: 5,
  outForDelivery: 9,
  comingToday: 20,
  stockAlerts: [
    { id: "s1", name: "Replacement 20L can — full", stock: 6, threshold: 10, unit: "cans" },
    { id: "s2", name: "Tabletop dispenser — rental", stock: 3, threshold: 5, unit: "units" },
    { id: "s3", name: "5L bottle", stock: 12, threshold: 15, unit: "bottles" },
  ],
  repeatCustomerRate: 68,
  subscription: "growth",
  nextBilling: "1 Nov 2026",
  chart: [
    { period: "Mon", revenue: 31800, orders: 21 },
    { period: "Tue", revenue: 42900, orders: 27 },
    { period: "Wed", revenue: 36600, orders: 25 },
    { period: "Thu", revenue: 52400, orders: 33 },
    { period: "Fri", revenue: 61000, orders: 39 },
    { period: "Sat", revenue: 47300, orders: 30 },
    { period: "Sun", revenue: 44150, orders: 28 },
  ],
  recentOrders: [
    { id: "o1", orderNumber: "#MF-98121", customer: "Jane Wanjiku", area: "Kasarani", items: "2 × 20L refill", total: 820, status: "out_for_delivery", time: "10:42" },
    { id: "o2", orderNumber: "#MF-98120", customer: "Moses Baraka", area: "Roysambu", items: "1 × 5L bottle", total: 120, status: "accepted", time: "10:18" },
    { id: "o3", orderNumber: "#MF-98119", customer: "Amina Yusuf", area: "Nyali", items: "3 × 20L refill", total: 1260, status: "pending", time: "10:02" },
    { id: "o4", orderNumber: "#MF-98118", customer: "Stephen Gachiri", area: "Elgon View", items: "1 × dispenser rental", total: 600, status: "delivered", time: "09:46" },
    { id: "o5", orderNumber: "#MF-98117", customer: "Lilian Koech", area: "Milimani", items: "2 × 20L refill", total: 700, status: "delivered", time: "09:12" },
  ],
  popularProducts: [
    { name: "Refill — 20L can", orders: 214, revenue: 74900 },
    { name: "5L bottle", orders: 96, revenue: 11520 },
    { name: "Replacement 20L can — full", orders: 54, revenue: 35100 },
  ],
};