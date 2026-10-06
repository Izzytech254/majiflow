export const easeOut = [0.16, 1, 0.3, 1] as const;

export const CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Machakos",
] as const;

export const ESTATES = [
  "South B",
  "Westlands",
  "Kasarani",
  "Kilimani",
  "Pipeline",
  "Nyali",
  "Milimani",
  "Langata",
  "Eastleigh",
  "Roysambu",
] as const;

/** Approximate coordinates for map fallbacks when live GPS is unavailable. */
export const ESTATE_COORDS: Record<string, { lat: number; lng: number }> = {
  "South B": { lat: -1.3085, lng: 36.8545 },
  Westlands: { lat: -1.2635, lng: 36.8025 },
  Kasarani: { lat: -1.2305, lng: 36.895 },
  Kilimani: { lat: -1.2925, lng: 36.784 },
  Pipeline: { lat: -1.3065, lng: 36.8865 },
  Nyali: { lat: -4.0305, lng: 39.7215 },
  Milimani: { lat: -0.0985, lng: 34.7605 },
  Langata: { lat: -1.3355, lng: 36.7425 },
  Eastleigh: { lat: -1.2765, lng: 36.8395 },
  Roysambu: { lat: -1.2245, lng: 36.9035 },
};

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Nairobi: { lat: -1.2921, lng: 36.8219 },
  Mombasa: { lat: -4.0435, lng: 39.6682 },
  Kisumu: { lat: -0.0917, lng: 34.768 },
  Nakuru: { lat: -0.3031, lng: 36.08 },
  Eldoret: { lat: 0.5143, lng: 35.2698 },
  Thika: { lat: -1.0332, lng: 37.0693 },
  Machakos: { lat: -1.5177, lng: 37.2634 },
};

