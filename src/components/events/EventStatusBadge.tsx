import {
  EVENT_STATUS_LABELS,
  type EventStatusBadge as Badge,
} from "@/lib/events/taxonomy";

const styles: Record<Badge, string> = {
  applications_open: "border-[#FFAB33]/45 text-[#FFAB33]",
  interest_list: "border-white/25 text-fb-body",
  invitation_only: "border-[#FFAB33]/35 text-[#FFAB33]",
  planning: "border-white/20 text-fb-secondary",
  sold_out: "border-white/20 text-fb-meta",
  waitlist: "border-white/25 text-fb-secondary",
  completed: "border-white/15 text-fb-meta",
  draft: "border-white/15 text-fb-meta",
};

export function EventStatusBadge({ status }: { status: Badge }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium tracking-[0.12em] uppercase ${styles[status]}`}
    >
      {EVENT_STATUS_LABELS[status]}
    </span>
  );
}
