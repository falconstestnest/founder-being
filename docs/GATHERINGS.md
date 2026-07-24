# Upcoming Gatherings (legacy note)

**Superseded by:** [EVENTS_DOMAIN.md](./EVENTS_DOMAIN.md)  

**Last verified:** 2026-07-25  

Public hub: `/events` · Form: `/events/interest?event={slug}`  
Homepage still anchors `#events` as a preview of the Events Hub.

---

## Positioning

Founder-Being creates intentional spaces where founders can slow down, think clearly, reflect honestly and build trusted relationships with fellow founders, investors and ecosystem leaders.

---

## CMS event classifications

| Event | Event type | Registration workflow | Status | `event_id` |
| ----- | ---------- | --------------------- | ------ | ---------- |
| Founder-Being Trivandrum Meetup | Community Meetup | Interest Registration | Planning | `evt_trivandrum_meetup_2026_08` |
| Capital & Clarity | Founder–Investor Retreat | Invitation Application | Planning | `evt_capital_clarity_2026_09` |
| Huddle Week Founder Reset | Conference-Side Gathering | Interest List | Planning | `evt_huddle_week_reset_2026_11` |
| Founder-Being UAE Ecosystem Day | Ecosystem Gathering | Invitation Request | Planning | `evt_uae_ecosystem_day_2026_12` |
| Kodaikanal Full Moon Retreat | Residential Retreat | Retreat Application | Open | `evt_kodaikanal_full_moon_2026` |

Source of truth: `src/lib/gatherings.ts`

---

## Registration forms

Each CTA opens `/gatherings/interest?event={slug}` with:

* `event_id`
* `event_name`
* `event_type`
* `city`
* `registration_workflow`

Submissions post to `POST /api/gatherings/interest` and are stored in `gathering_interest` (Supabase) when configured.

**Note:** Huddle Global and Expand North Star are third-party events. Founder-Being is not affiliated with or organising those conferences; disclaimers appear on the public cards.

---

## Affiliation disclaimers

* [Huddle Global 2026](https://www.huddleglobal.co.in/) — 12–14 Nov 2026, The Leela Raviz Kovalam  
* [Expand North Star 2026](https://expandnorthstar.com/) — 8–10 Dec 2026, Dubai Exhibition Centre  

Founder-Being side gatherings are independent.
