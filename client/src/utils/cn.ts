// Tiny className joiner (avoids pulling in clsx/tailwind-merge for Phase 1).
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');
