import type { StatusBadgeTone } from "./ui/StatusBadge";

export const formatCplayCurrency = (value?: number | null) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export const getActiveStatePresentation = (
  active?: boolean | null,
): { label: string; tone: StatusBadgeTone } =>
  active
    ? { label: "Ativo", tone: "success" }
    : { label: "Inativo", tone: "neutral" };
