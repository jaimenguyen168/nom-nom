export type PlanId = "free" | "starter" | "pro" | "premium";
export type BillingInterval = "monthly" | "yearly";

export type PlanFeature = {
  label: string;
  included: boolean;
};

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  price: Record<BillingInterval, number>;
  highlighted?: boolean;
  ctaLabel: string;
  limits: {
    aiRecipesPerMonth: number | null;
    aiBlogsPerMonth: number | null;
  };
  features: PlanFeature[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Taste the kitchen.",
    price: { monthly: 0, yearly: 0 },
    ctaLabel: "Start cooking",
    limits: { aiRecipesPerMonth: 3, aiBlogsPerMonth: 1 },
    features: [
      { label: "3 recipe inspirations per month", included: true },
      { label: "1 blog inspiration per month", included: true },
      { label: "Save & organize favorites", included: true },
      { label: "Standard quality", included: true },
      { label: "Premium quality & cover images", included: false },
      { label: "Priority queue", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "For weekend chefs.",
    price: { monthly: 6, yearly: 5 },
    ctaLabel: "Upgrade to Starter",
    limits: { aiRecipesPerMonth: 25, aiBlogsPerMonth: 10 },
    features: [
      { label: "25 recipe inspirations per month", included: true },
      { label: "10 blog inspirations per month", included: true },
      { label: "Improved quality", included: true },
      { label: "Watermark-free cover images", included: true },
      { label: "Priority queue", included: false },
      { label: "Early access to new features", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For serious home cooks.",
    price: { monthly: 15, yearly: 12 },
    highlighted: true,
    ctaLabel: "Go Pro",
    limits: { aiRecipesPerMonth: 100, aiBlogsPerMonth: 50 },
    features: [
      { label: "100 recipe inspirations per month", included: true },
      { label: "50 blog inspirations per month", included: true },
      { label: "Premium quality", included: true },
      { label: "Inspired recipe cover images", included: true },
      { label: "Priority queue", included: true },
      { label: "Early access to new features", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Cook like a pro.",
    price: { monthly: 29, yearly: 24 },
    ctaLabel: "Go Premium",
    limits: { aiRecipesPerMonth: null, aiBlogsPerMonth: null },
    features: [
      { label: "Unlimited recipe inspirations", included: true },
      { label: "Unlimited blog inspirations", included: true },
      { label: "Premium quality", included: true },
      { label: "Inspired recipe cover images", included: true },
      { label: "Priority queue", included: true },
      { label: "Early access to new features", included: true },
    ],
  },
];

export const DEFAULT_PLAN: PlanId = "free";

export const getPlan = (id: PlanId): Plan =>
  PLANS.find((p) => p.id === id) ?? PLANS[0];

export const formatLimit = (limit: number | null) =>
  limit === null ? "Unlimited" : limit.toString();
