/**
 * Shared Tailwind class strings for primary (yellow CTA) and secondary actions.
 * Keeps button styling consistent without a separate UI library.
 */

export const buttonCta =
  "rounded-none border-2 border-ink bg-cta px-4 py-2 font-semibold text-ink transition-[filter] hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55";

export const buttonCtaCompact =
  "rounded-none border-2 border-ink bg-cta px-2.5 py-1.5 text-[0.78rem] font-semibold leading-none text-ink transition-[filter] hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55";

export const buttonSecondary =
  "rounded-none border-2 border-ink bg-surface px-4 py-2 font-semibold text-ink transition-colors hover:bg-page-bg disabled:cursor-not-allowed disabled:opacity-55";
