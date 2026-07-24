/**
 * Unified event participation model.
 * Counts are always derived from records — never primary source of truth.
 */

import type { RegistrationWorkflow } from "@/lib/events/taxonomy";

export const PARTICIPATION_STATUSES = [
  "interested",
  "applied",
  "under_review",
  "waitlisted",
  "invited",
  "confirmed",
  "payment_pending",
  "paid",
  "declined",
  "cancelled",
  "attended",
  "no_show",
] as const;

export type ParticipationStatus = (typeof PARTICIPATION_STATUSES)[number];

export const PARTICIPATION_STATUS_LABELS: Record<ParticipationStatus, string> = {
  interested: "Interested",
  applied: "Applied",
  under_review: "Under Review",
  waitlisted: "Waitlisted",
  invited: "Invited",
  confirmed: "Confirmed",
  payment_pending: "Payment Pending",
  paid: "Paid",
  declined: "Declined",
  cancelled: "Cancelled",
  attended: "Attended",
  no_show: "No Show",
};

/** Valid statuses per registration workflow */
export const WORKFLOW_STATUSES: Record<
  RegistrationWorkflow,
  ParticipationStatus[]
> = {
  interest: [
    "interested",
    "invited",
    "confirmed",
    "declined",
    "cancelled",
    "attended",
    "no_show",
  ],
  interest_list: [
    "interested",
    "invited",
    "confirmed",
    "declined",
    "cancelled",
    "attended",
    "no_show",
  ],
  application: [
    "applied",
    "under_review",
    "waitlisted",
    "invited",
    "confirmed",
    "payment_pending",
    "paid",
    "declined",
    "cancelled",
    "attended",
    "no_show",
  ],
  invitation: [
    "interested",
    "invited",
    "confirmed",
    "declined",
    "cancelled",
    "attended",
    "no_show",
  ],
  invitation_application: [
    "applied",
    "under_review",
    "waitlisted",
    "invited",
    "confirmed",
    "payment_pending",
    "paid",
    "declined",
    "cancelled",
    "attended",
    "no_show",
  ],
  community_signup: ["interested", "confirmed", "cancelled"],
};

export type DerivedCapacity = {
  capacity: number | null;
  interested: number;
  applied: number;
  underReview: number;
  invited: number;
  confirmed: number;
  paymentPending: number;
  paid: number;
  waitlisted: number;
  declined: number;
  cancelled: number;
  attended: number;
  noShow: number;
};

export function emptyDerivedCapacity(
  capacity: number | null = null,
): DerivedCapacity {
  return {
    capacity,
    interested: 0,
    applied: 0,
    underReview: 0,
    invited: 0,
    confirmed: 0,
    paymentPending: 0,
    paid: 0,
    waitlisted: 0,
    declined: 0,
    cancelled: 0,
    attended: 0,
    noShow: 0,
  };
}

/** Derive capacity metrics from participation status list */
export function deriveCapacity(
  capacity: number | null,
  statuses: ParticipationStatus[],
): DerivedCapacity {
  const d = emptyDerivedCapacity(capacity);
  for (const s of statuses) {
    switch (s) {
      case "interested":
        d.interested++;
        break;
      case "applied":
        d.applied++;
        break;
      case "under_review":
        d.underReview++;
        break;
      case "invited":
        d.invited++;
        break;
      case "confirmed":
        d.confirmed++;
        break;
      case "payment_pending":
        d.paymentPending++;
        break;
      case "paid":
        d.paid++;
        break;
      case "waitlisted":
        d.waitlisted++;
        break;
      case "declined":
        d.declined++;
        break;
      case "cancelled":
        d.cancelled++;
        break;
      case "attended":
        d.attended++;
        break;
      case "no_show":
        d.noShow++;
        break;
    }
  }
  return d;
}

export function isValidStatusForWorkflow(
  workflow: RegistrationWorkflow,
  status: ParticipationStatus,
) {
  return WORKFLOW_STATUSES[workflow].includes(status);
}
