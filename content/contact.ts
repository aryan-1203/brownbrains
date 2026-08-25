import { services } from "./services";

/** Budget bands offered in the form. Ids are stored, labels are displayed. */
export const budgetOptions = [
  { id: "exploring", label: "Still exploring" },
  { id: "under-1l", label: "Under ₹1 lakh" },
  { id: "1l-5l", label: "₹1–5 lakh" },
  { id: "5l-15l", label: "₹5–15 lakh" },
  { id: "15l-plus", label: "₹15 lakh and up" },
] as const;

export const serviceOptions = [
  ...services.map((service) => ({ id: service.slug, label: service.title })),
  { id: "not-sure", label: "Not sure yet" },
] as const;

// Widened to string[] so validation can test arbitrary submitted values.
export const budgetIds: readonly string[] = budgetOptions.map(
  (option) => option.id,
);
export const serviceIds: readonly string[] = serviceOptions.map(
  (option) => option.id,
);

export function budgetLabel(id: string) {
  return budgetOptions.find((option) => option.id === id)?.label ?? id;
}

export function serviceLabel(id: string) {
  return serviceOptions.find((option) => option.id === id)?.label ?? id;
}
