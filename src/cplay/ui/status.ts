export type FollowUpVisualState =
  | "missing"
  | "overdue"
  | "due-soon"
  | "scheduled";

const DUE_SOON_WINDOW_MS = 24 * 60 * 60 * 1000;

export const getFollowUpVisualState = (
  date?: string | null,
  now = new Date(),
): FollowUpVisualState => {
  if (!date) return "missing";

  const target = new Date(date);
  if (Number.isNaN(target.getTime())) return "missing";

  const diff = target.getTime() - now.getTime();
  if (diff < 0) return "overdue";
  if (diff <= DUE_SOON_WINDOW_MS) return "due-soon";
  return "scheduled";
};
