# Product Requirements Document

## Founder Being Kodaikanal Full Moon Retreat Signup Page

**Version:** 1.0  
**Date:** 25 July 2026  
**Status:** Implementation-ready draft  
**Product owners:** Jimmy James and Jithin Mammen  
**Organisation:** Founder Being  
**Event dates:** 26–31 August 2026  
**Location:** Kodaikanal, Tamil Nadu  

---

## 1. Executive Summary

Founder Being requires a dedicated public signup page for its first residential founders' retreat: a six-day, five-night full-moon retreat in Kodaikanal for 15 selected founders.

The page must:

1. Explain the retreat clearly and credibly.
2. Present the dates, programme, facilitator, inclusions, pricing and selection process.
3. Collect applications rather than sell tickets instantly.
4. Store applications securely in Supabase.
5. Give Founder Being an authenticated admin workflow to review applicants, select founders, contact them and manually record payments.
6. Support a go/no-go decision if the minimum number of paid participants is not achieved.

There will be **no online payment gateway in the MVP**. Selected founders will be contacted personally by phone or WhatsApp by **3 August 2026** and given private UPI or bank-transfer instructions.

The public page must not expose Founder Being's internal costs, projected profit, facilitator commercial terms, vendor quotations, applicant scores or private admin notes.

---

## 2. Locked Product Decisions

| Decision | Requirement |
|---|---|
| Event | Founder Being Kodaikanal Full Moon Retreat |
| Dates | Wednesday, 26 August to Monday, 31 August 2026 |
| Duration | Six days and five nights |
| Capacity | 15 paying founders |
| Minimum viable cohort | 12 paid founders |
| Format | Application and approval-based |
| Departure point | Kochi |
| Destination | Premium nature resort in Kodaikanal |
| Exact venue | Not public until the resort is contracted |
| Lead facilitator | Anjaan, subject to final confirmation and permission to announce |
| Early-bird fee | ₹54,500 for the first five selected founders who pay the deposit |
| Standard fee | ₹57,500 for the remaining ten founders |
| Website payment | None in MVP |
| Payment method | Private UPI or bank-transfer instructions after selection |
| Contact deadline | Selected founders contacted by phone/WhatsApp by 3 August 2026 |
| Go/no-go date | 10 August 2026 |
| Technology | Existing website frontend + Supabase Postgres/Auth/Storage |

All dates, prices and operational thresholds must be stored as database or CMS configuration, not hardcoded throughout the frontend.

---

## 3. Product Goals

### 3.1 Primary goals

- Fill a curated cohort of 15 suitable founders.
- Make the retreat feel considered, premium, calm and trustworthy.
- Collect enough information to assess founder-retreat fit without creating a burdensome application.
- Create a controlled selection and manual payment workflow.
- Protect applicant personal information.
- Give Jimmy and Jithin a clear real-time view of applications, selections and paid seats.
- Preserve the option to postpone if the minimum paid cohort is not achieved.

### 3.2 Success metrics

- At least 25 complete applications.
- At least 15 qualified applications.
- At least 12 deposits received by 8 August.
- 15 paid seats targeted before final operational lock.
- Application completion rate above 55%.
- Zero duplicate paid seats.
- Zero exposure of private applicant or payment data.
- No personal data sent to analytics platforms.

### 3.3 Non-goals for the MVP

- Public instant ticket purchasing.
- Automated payment gateway.
- Applicant login or self-service account.
- Public attendee directory.
- Automated applicant scoring or AI selection.
- Automated WhatsApp campaigns.
- Room-allocation engine.
- Medical assessment or therapeutic services.

---

## 4. Audience and Positioning

### 4.1 Primary audience

- Startup founders and co-founders.
- Founder-operators currently carrying business pressure, uncertainty or major decisions.
- Founders willing to participate respectfully in reflection, mindfulness and peer conversation.
- Founders comfortable with a curated cohort and twin-sharing accommodation.

The retreat is not restricted by startup stage, funding status or company size.

### 4.2 Positioning

**Founder Being — Empowering the Entrepreneurial Mind**

Supporting copy:

- Conversations Beyond Startup Pressure.
- Six days to slow down, reflect and return with greater clarity.
- Not a pitch event.
- Not a panel discussion.
- Not a productivity workshop.
- A curated space for founders to rest, reconnect and examine what they are carrying.

### 4.3 Public tone

- Calm, intelligent and grounded.
- Premium without being extravagant.
- Spiritual but not mystical or medically suggestive.
- Honest about selection, venue confirmation and minimum participation.
- No artificial scarcity counters, fake testimonials or manipulative urgency.

---

## 5. Public Page Route and Information Architecture

### 5.1 Recommended route

`/retreats/kodaikanal-full-moon-2026`

The route should be shareable independently while remaining visually consistent with the main Founder Being website.

### 5.2 Page sections

1. Header/navigation
2. Hero
3. Essential retreat facts
4. Why this retreat exists
5. Who should apply
6. Lead facilitator
7. Day-by-day programme
8. What is included and excluded
9. Pricing
10. Application and selection process
11. Important dates
12. Frequently asked questions
13. Application form
14. Legal, wellbeing and privacy notices
15. Footer

Use repeated **Apply to Attend** calls to action that scroll to the form.

---

## 6. Public Page Content Requirements

### 6.1 Hero

**Eyebrow:** Founder Being presents  

**Headline:** Kodaikanal Full Moon Retreat  

**Subheadline:** A six-day residential immersion for 15 founders to rest, reflect, reconnect and return with greater clarity.

**Facts:**

- 26–31 August 2026
- Kodaikanal, Tamil Nadu
- Six days / five nights
- Application and approval required
- Retreat fee from ₹54,500

**Primary CTA:** Apply to Attend  
**Secondary CTA:** View the Programme

Do not show a “Buy Now” or “Book Now” button.

### 6.2 Venue wording

Until a resort is contracted, the public page must say:

> A carefully selected premium nature resort in Kodaikanal. The exact property and arrival details will be shared with confirmed participants.

The internal shortlist is:

- GReaT Trails Kodaikanal by GRT Hotels
- Zacs Valley Resort & Wellness Retreat
- Le Poshe by Sparsa

The shortlist is admin-only and must not appear publicly unless Founder Being intentionally chooses to show it.

### 6.3 Why the retreat exists

Core message:

Founders are taught to raise capital, build teams, ship products and scale companies. Very few are taught how to carry uncertainty, responsibility, loneliness and ambition without losing themselves.

This retreat creates time and space for founders to:

- Step away from operational noise.
- Recover from sustained pressure.
- Examine identity, ambition, fear and responsibility.
- Develop practical mindfulness and relaxation tools.
- Work quietly when required.
- Build honest relationships with other founders.

### 6.4 Lead facilitator

If Anjaan has provided written confirmation and image/name permission, show:

**Anjaan — Lead Guru and Facilitator**

His role includes:

- Yoga and mindful movement.
- Breathwork and evening meditation.
- Founder-focused reflective immersions.
- Full-moon meditation.
- Mindfulness and deep relaxation.
- Yoga Nidra and nervous-system regulation practices.
- Closing integration circle.

If confirmation or permission is not recorded in the admin system, replace the section with:

> Lead facilitator to be announced.

Do not publish Anjaan's honorarium or private travel arrangements.

### 6.5 Pricing

Display:

- **Early bird:** ₹54,500 — first five selected founders who complete the reservation deposit.
- **Standard:** ₹57,500 — remaining ten founders.

The price assignment must depend on the order in which approved applicants' deposits are received, not simply the application timestamp.

The page should state:

> Applying does not reserve a seat. A seat is confirmed only after selection and receipt of the required payment.

Before launch, Founder Being must confirm with its accountant whether the public price should say “inclusive of applicable taxes” and whether any GST disclosure is required.

### 6.6 Included

- Round-trip group transportation from Kochi to Kodaikanal.
- Five nights of twin-sharing accommodation.
- Breakfast, lunch, dinner, tea and planned travel refreshments.
- All scheduled yoga, meditation, mindfulness and founder-immersion sessions.
- Access to the indoor retreat/work space.
- Retreat journal or participant kit.
- Founder networking and facilitated group conversations.

### 6.7 Excluded

- Travel to and from Kochi.
- Personal purchases.
- Spa treatments or optional paid resort activities.
- Private-room supplements, unless separately offered.
- Personal travel or medical insurance.
- Medical or psychological treatment.

### 6.8 Wellbeing disclaimer

The page must state clearly:

> Founder Being is a wellbeing and reflective community experience. It is not a medical, psychiatric or psychological treatment programme. All physical and meditative practices are voluntary. Selected participants will be asked privately about relevant accessibility, dietary or health considerations so that reasonable arrangements can be discussed.

Avoid claims such as “heals depression,” “treats burnout,” “cures anxiety” or any guaranteed outcome.

---

## 7. Tentative Day-by-Day Programme

The page must label the programme as tentative and state that timings may change based on weather, group needs and the facilitator's final design.

### Day 1 — Wednesday, 26 August

**Journey, arrival and grounding**

- Depart Kochi at approximately 6:30 AM.
- Breakfast and lunch during the journey.
- Arrive and check in during the afternoon.
- Rest and welcome tea.
- Opening circle.
- Gentle grounding meditation.
- Group dinner and early rest.

### Day 2 — Thursday, 27 August

**Rest and decompression**

- Unstructured morning and breakfast.
- Optional nature walk.
- Rest, journalling and quiet work.
- Free afternoon.
- Evening breathwork and guided meditation.
- Group dinner and reflection.

### Day 3 — Friday, 28 August

**Founder immersion and full-moon practice**

- Morning yoga and reflective practice.
- Founder immersion exploring pressure, identity, ambition, fear and responsibility.
- Lunch and rest.
- Free time for work, journalling or one-to-one conversations.
- Full-moon meditation led by Anjaan.
- Silent or reflective dinner.

### Day 4 — Saturday, 29 August

**Mindfulness and inner regulation**

- Morning mindful movement or meditation.
- Mindfulness and attention session.
- Deep-relaxation and nervous-system regulation practice.
- Lunch and free work/rest time.
- Optional nature walk.
- Evening Yoga Nidra and meditation.

### Day 5 — Sunday, 30 August

**Founder connection and integration**

- Slow, unstructured morning.
- Founder networking and peer conversations.
- Free time, optional local activity or quiet work.
- Personal reflection.
- Closing circle.
- Final evening meditation.
- Prepare for departure.

### Day 6 — Monday, 31 August

**Return**

- Breakfast and short morning grounding.
- Check out and depart at approximately 8:00 AM.
- Lunch during the return journey.
- Expected Kochi arrival between 4:00 PM and 6:00 PM.

---

## 8. Application Form

### 8.1 Form design

Use a three-step mobile-first form with a clear progress indicator:

1. Founder profile
2. Intent and fit
3. Logistics and consent

Do not require an account. Do not collect payment information in the form.

### 8.2 Step 1 — Founder profile

| Field | Requirement |
|---|---|
| Full name | Required; 2–100 characters |
| Email | Required; lowercase-normalised |
| WhatsApp/mobile number | Required; stored in E.164 format |
| City/country | Required |
| Startup/company | Required |
| Current role | Required |
| LinkedIn URL | Required unless a company website is supplied |
| Company website | Optional |
| Startup stage | Required dropdown |

Startup-stage options:

- Idea / pre-launch
- Early revenue
- Growing
- Scaling
- Mature / established
- Between ventures

### 8.3 Step 2 — Intent and fit

| Field | Requirement |
|---|---|
| Why would you like to join this retreat? | Required; 150–1,500 characters |
| What would make this retreat valuable for you? | Required; 100–1,000 characters |
| What are you currently carrying as a founder? | Optional; 1,000-character maximum |
| Have you attended a Founder Being event before? | Required yes/no |
| Referral/source | Optional dropdown/text |

Do not ask for medical diagnoses, medication history or detailed mental-health information on the public application.

### 8.4 Step 3 — Logistics and consent

| Field | Requirement |
|---|---|
| Will you join group travel from Kochi? | Required yes/no/not sure |
| Are you comfortable with twin-sharing? | Required yes/no |
| Dietary preference | Optional, basic categories only |
| Accessibility support required | Optional short text |
| Terms acceptance | Required |
| Privacy consent | Required |
| Marketing consent | Optional and unchecked by default |

Required declarations:

- I understand that this is an application and does not guarantee selection.
- I understand that my seat is confirmed only after payment.
- I have read the tentative cancellation and postponement policy.
- I agree to participate respectfully and maintain the confidentiality of personal group conversations.

### 8.5 Data collected only after selection/payment

Collect these in a separate private confirmation form:

- Emergency contact.
- Government ID details required by the resort.
- Detailed dietary/allergy information.
- Health/accessibility considerations relevant to physical practices.
- Roommate preference.
- Travel-arrival details.

These fields must not be part of the public application.

### 8.6 Form behaviour

- Autosave only non-sensitive draft data in `sessionStorage`; clear it after submission.
- Do not persist the application draft indefinitely in browser `localStorage`.
- Validate on both client and server.
- Preserve values when field validation fails.
- Prevent accidental double submission.
- Show an inline character counter for long-answer fields.
- Disable the submit button only while a request is actively processing.
- Provide a clear error summary and move focus to it for accessibility.
- Generate a non-sequential application code such as `FBK-26-X7Q9M2`.
- Show the code on the success page and include it in the confirmation email.

### 8.7 Success state

Headline:

> Application received.

Body:

> Thank you for applying to the Founder Being Kodaikanal Full Moon Retreat. Every application is reviewed personally. If selected in the first round, we will contact you by phone or WhatsApp by 3 August 2026. Applying does not reserve a seat and no payment is required on this website.

Show:

- Application reference.
- Contact email/WhatsApp for corrections.
- “Add dates to calendar” action clearly labelled as tentative.
- No public bank or UPI details.

---

## 9. Selection and Manual Payment Workflow

### 9.1 Application lifecycle

Statuses:

1. `submitted`
2. `under_review`
3. `shortlisted`
4. `selected`
5. `contacted`
6. `payment_pending`
7. `deposit_paid`
8. `paid`
9. `waitlisted`
10. `rejected`
11. `withdrawn`
12. `refunded`
13. `cancelled`

Every status change must be timestamped and written to an audit/history table.

### 9.2 Selection process

- Jimmy and Jithin review applications manually.
- Selection is based on founder fit, intent, willingness to participate and cohort balance.
- Do not select based on funding raised, fame or company valuation alone.
- Admin may add private review notes and an optional internal 1–5 fit rating.
- No automated rejection based on form answers.
- Applicants should receive a clear selected, waitlisted or not-selected communication.

### 9.3 MVP payment process

1. Approved applicant is moved to `selected`.
2. Admin contacts the founder by phone or WhatsApp no later than **3 August**.
3. Payment instructions are shared privately.
4. Proposed reservation deposit: **₹15,000**.
5. Early-bird fee is locked for the first five selected founders whose deposits clear.
6. Admin records the payment manually.
7. Founder receives a payment acknowledgement and provisional seat confirmation.
8. Minimum of 12 deposits targeted by **8 August**.
9. Founder Being makes the final go/no-go decision by **10 August**.
10. If proceeding, the remaining balance is due by **14 August**.
11. Seat status changes to `paid` only after the full amount is received.

The deposit and balance deadlines must be admin-configurable.

### 9.4 Payment recording

Store:

- Amount due.
- Amount received.
- Payment method.
- Masked transaction reference.
- Contacted timestamp.
- Deposit-received timestamp.
- Balance-received timestamp.
- Admin who recorded the payment.
- Receipt or acknowledgement number.
- Optional proof file in a private storage bucket.

Do not store:

- Full bank account credentials.
- UPI PINs.
- Card data.
- Unmasked personal banking information.

No applicant should be marked paid automatically in the MVP.

### 9.5 Cancellation and postponement policy

Draft policy to approve before publishing:

- If Founder Being cancels the retreat, payments are refunded in full.
- If minimum participation is not achieved, the applicant may choose a full refund or transfer to a rescheduled retreat.
- Before the 10 August go/no-go confirmation, deposits remain refundable if the event does not proceed.
- After Founder Being confirms the retreat and commits to vendors, participant payments become non-refundable, but may be transferred to another Founder Being-approved founder where operationally possible.
- Force-majeure treatment must follow the actual resort and transport cancellation terms.

The final published policy must be reviewed against the signed vendor contracts.

---

## 10. Admin Requirements

### 10.1 Authentication

- Admin area requires Supabase Auth.
- Only allowlisted Founder Being admins may enter.
- Initial roles: `owner`, `reviewer`, `finance`.
- Jimmy and Jithin receive `owner`.
- Finance users may record payments but cannot edit application answers.
- All admin routes must be excluded from search indexing.

### 10.2 Dashboard

Show:

- Total applications.
- Complete vs incomplete/failed submissions.
- Under review.
- Shortlisted.
- Selected.
- Contacted by 3 August.
- Deposit paid.
- Fully paid.
- Waitlisted.
- Rejected/withdrawn.
- Seats remaining.
- Early-bird seats remaining.
- Total amount collected.
- Outstanding balance.
- Progress toward the minimum cohort of 12.
- Progress toward capacity of 15.

### 10.3 Application list

Required functions:

- Search by name, email, phone, company or application code.
- Filter by status, startup stage, city, prior Founder Being attendance and travel preference.
- Sort by submitted date, status and last activity.
- Open applicant detail.
- Assign reviewer.
- Add private notes.
- Change status.
- Generate phone and WhatsApp contact links.
- Export approved operational data to CSV.

Do not export sensitive post-selection health or ID data into general CSV files.

### 10.4 Applicant detail

Show:

- Application answers.
- Consent timestamps.
- Review notes.
- Status history.
- Contact history.
- Payment summary.
- Communication history.
- Relevant travel and rooming details after confirmation.

### 10.5 Admin safeguards

- Require confirmation before marking an applicant paid, rejected, refunded or cancelled.
- Do not allow more than 15 paid seats without an explicit owner override.
- Show a warning when changing a paid applicant's status.
- Log all changes to payment, status and pricing.
- Prevent deletion of financial records; use reversals/refund entries.

---

## 11. Recommended Technical Architecture

### 11.1 Preferred stack

- **Frontend:** Existing Founder Being website; Next.js App Router preferred if the site is being rebuilt.
- **Hosting:** Vercel or the existing production platform.
- **Database:** Supabase Postgres.
- **Admin authentication:** Supabase Auth.
- **Private documents:** Supabase Storage private bucket.
- **Transactional email:** Existing provider, or Resend/Postmark if none exists.
- **Spam protection:** Cloudflare Turnstile with mandatory server-side verification.

Supabase is preferred over Neon for this MVP because database, Auth, Storage and Row Level Security can be managed together. Supabase documents RLS as a Postgres-level defence and integrates Storage access with RLS policies:

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control

If Founder Being already has a secure admin-auth and file-storage stack, Neon can replace Supabase Postgres while preserving the same logical schema.

### 11.2 Public submission architecture

The browser must not write directly to unrestricted database tables.

Recommended flow:

1. Browser submits to a server route.
2. Server validates Turnstile token.
3. Server applies rate limits.
4. Server validates and normalises all fields.
5. Server checks duplicates/idempotency.
6. Server inserts the application using server-only credentials.
7. Server returns only the application reference.
8. Transactional confirmation is queued.

Cloudflare requires Turnstile tokens to be validated server-side:

- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

### 11.3 Required environment variables

Public:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY`
- Transactional email API key
- Application-code signing/randomisation secret if used

Never expose the Supabase service-role key or Turnstile secret in client code, browser logs or source control.

---

## 12. Supabase Data Model

### 12.1 `retreats`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `slug` | text unique | Public route identifier |
| `title` | text | Event title |
| `location_public` | text | Kodaikanal, Tamil Nadu |
| `venue_private` | text nullable | Admin-only |
| `starts_at` | timestamptz | Event start |
| `ends_at` | timestamptz | Event end |
| `capacity` | integer | Default 15 |
| `minimum_paid` | integer | Default 12 |
| `early_bird_capacity` | integer | Default 5 |
| `early_bird_price` | numeric(10,2) | 54500 |
| `standard_price` | numeric(10,2) | 57500 |
| `application_deadline` | timestamptz | Admin-configurable |
| `contact_deadline` | timestamptz | 3 Aug 2026 |
| `go_no_go_date` | date | 10 Aug 2026 |
| `status` | enum | draft/open/closed/confirmed/postponed/cancelled/completed |
| `facilitator_public` | boolean | Publish Anjaan only when true |
| `created_at` | timestamptz | Default now |
| `updated_at` | timestamptz | Trigger-managed |

### 12.2 `retreat_applications`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `retreat_id` | uuid | Foreign key |
| `application_code` | text unique | Random, non-sequential |
| `full_name` | text | Required |
| `email_normalized` | citext/text | Required |
| `phone_e164` | text | Required |
| `city_country` | text | Required |
| `company_name` | text | Required |
| `current_role` | text | Required |
| `linkedin_url` | text nullable | Valid URL |
| `company_url` | text nullable | Valid URL |
| `startup_stage` | enum | Controlled values |
| `motivation` | text | Required |
| `desired_outcome` | text | Required |
| `founder_context` | text nullable | Optional |
| `attended_before` | boolean | Required |
| `referral_source` | text nullable | Optional |
| `kochi_transport` | enum | yes/no/unsure |
| `twin_sharing` | boolean | Required |
| `dietary_basic` | text nullable | Minimal |
| `accessibility_basic` | text nullable | Minimal |
| `privacy_consent_at` | timestamptz | Required |
| `terms_consent_at` | timestamptz | Required |
| `marketing_consent_at` | timestamptz nullable | Separate opt-in |
| `status` | enum | Application lifecycle |
| `assigned_reviewer` | uuid nullable | Admin user |
| `internal_rating` | smallint nullable | 1–5; admin-only |
| `utm_source` | text nullable | Attribution |
| `utm_medium` | text nullable | Attribution |
| `utm_campaign` | text nullable | Attribution |
| `referrer` | text nullable | Attribution |
| `ip_hash` | text nullable | Abuse control; never raw IP |
| `created_at` | timestamptz | Default now |
| `updated_at` | timestamptz | Trigger-managed |

Constraints:

- Unique `(retreat_id, email_normalized)`.
- Unique `(retreat_id, phone_e164)`.
- Character-length checks.
- Valid status and startup-stage enums.
- At least one of LinkedIn or company URL.

### 12.3 `application_status_history`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `application_id` | uuid | Foreign key |
| `from_status` | text nullable | Previous |
| `to_status` | text | New |
| `reason` | text nullable | Admin note |
| `changed_by` | uuid nullable | Admin/system |
| `created_at` | timestamptz | Default now |

### 12.4 `application_notes`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `application_id` | uuid | Foreign key |
| `note` | text | Admin-only |
| `created_by` | uuid | Admin |
| `created_at` | timestamptz | Default now |
| `updated_at` | timestamptz | Trigger-managed |

### 12.5 `payment_records`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `application_id` | uuid | Foreign key |
| `pricing_tier` | enum | early_bird/standard/manual_override |
| `amount_due` | numeric(10,2) | Total fee |
| `amount_received` | numeric(10,2) | Transaction amount |
| `payment_type` | enum | deposit/balance/full/refund |
| `method` | enum | bank_transfer/upi/cash/other |
| `reference_masked` | text nullable | No full banking data |
| `proof_path` | text nullable | Private bucket |
| `received_at` | timestamptz nullable | Actual receipt |
| `recorded_by` | uuid | Admin |
| `created_at` | timestamptz | Default now |

Use multiple immutable records for deposit, balance and refunds. Derive totals; do not overwrite history.

### 12.6 `post_selection_details`

Store separately because this table may contain more sensitive information:

- Emergency contact.
- Government-ID reference required by venue.
- Allergies/dietary requirements.
- Relevant health/accessibility notes.
- Roommate preference.
- Travel-arrival details.

Access must be restricted to owners and designated operations users.

---

## 13. Security, Privacy and Standard Practices

### 13.1 Row Level Security

- Enable RLS on every public-schema table.
- Public/anonymous users receive no `SELECT`, `UPDATE` or `DELETE` policy.
- Public applications are inserted through the validated server route.
- Authenticated admin policies must check an allowlisted admin profile and role.
- Storage proof files use a private bucket with signed URLs and short expiry.
- Test all RLS policies with anon, reviewer, finance and owner roles.

Supabase recommends RLS as defence in depth and requires careful policy review:

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/getting-started/api-keys

### 13.2 Input and abuse protection

- Use a schema validator such as Zod on the server.
- Normalise email, phone and URLs before insertion.
- Strip HTML from free-text fields.
- Enforce database constraints in addition to app validation.
- Verify Turnstile server-side.
- Rate limit by hashed IP and email/phone combination.
- Add an invisible honeypot field.
- Apply an idempotency key to prevent duplicate submissions.
- Set request-size and free-text limits.
- Return generic duplicate/error messages without leaking applicant data.

### 13.3 Data minimisation

- Collect only what is needed for selection.
- Keep marketing consent optional and separate.
- Do not send form answers, phone, email, application code or payment values to GA4.
- Do not place personal data in URLs.
- Redact personal data from application logs and error reporting.
- Avoid collecting ID and detailed wellbeing information until after selection.

### 13.4 Retention

Proposed retention policy:

- Unsuccessful applications: delete or anonymise 90 days after the retreat.
- Withdrawn applications: delete or anonymise after operational and dispute needs expire.
- Sensitive post-selection health/accessibility notes: delete 30 days after the retreat unless legally required or explicitly consented.
- Payment/accounting records: retain only for the legally required finance period.
- Marketing contact: retain only where separate marketing consent exists.

Publish a privacy notice covering purpose, retention, access and correction requests.

### 13.5 Audit and backup

- Log status, payment, pricing and refund changes.
- Enable database backups appropriate to the Supabase plan.
- Create a pre-launch backup/export of configuration.
- Test restore procedures before applications open if time permits.
- Do not use destructive hard deletes for payment history.

---

## 14. Communications

### 14.1 Applicant messages

Required templates:

1. Application received.
2. Selected — expect a payment call/message.
3. Waitlisted.
4. Not selected.
5. Deposit received.
6. Retreat confirmed and balance due.
7. Full payment received.
8. Retreat postponed.
9. Retreat cancelled and refund process.
10. Pre-departure information.

### 14.2 Communication rules

- Application receipt must not imply acceptance.
- Selected messages must not expose public payment details.
- Admin records `contacted_at` after each phone/WhatsApp contact.
- Payment instructions should be sent through an official Founder Being number/email.
- Use one consistent sender identity.
- Include the application code in communications.
- Maintain a manual call list for applicants not reached by 3 August.

---

## 15. SEO and Social Sharing

### 15.1 Metadata

**Title:**

`Founder Being Full Moon Retreat, Kodaikanal | 26–31 August 2026`

**Meta description:**

`Apply for a six-day Founder Being retreat in Kodaikanal for 15 selected founders—mindfulness, meditation, reflection, focused work and honest founder conversations.`

**Canonical:**

`https://<founder-being-domain>/retreats/kodaikanal-full-moon-2026`

### 15.2 Structured data

Add Schema.org `Event` JSON-LD:

- Name.
- Description.
- Start/end dates.
- Offline attendance mode.
- Kodaikanal as the public location until the venue is contracted.
- Founder Being as organiser.
- Anjaan as performer/facilitator only after confirmation.
- Early-bird and standard offers.
- Event status.
- Public page URL.
- Event image.

Update `eventStatus` if the retreat is postponed, rescheduled or cancelled:

- https://schema.org/Event

### 15.3 Indexing

- Retreat page: index/follow.
- Application success page: noindex.
- Admin pages: noindex and authentication-protected.
- Private confirmation forms: noindex and token/auth protected.
- Include retreat page in sitemap.
- Generate an OG image using Founder Being branding and Kodaikanal landscape imagery.

---

## 16. Design Requirements

### 16.1 Brand

- Use the official Founder Being logo.
- Use the existing Midnight/Dawn visual system.
- Primary accent is based on Founder Being CMYK `01,42,91,00`; use the approved digital colour token from the brand asset where available.
- Preferred typography: Cormorant for expressive headings, Inter for body, JB Mono for labels/metadata.
- Use warm cream backgrounds, midnight text and restrained dawn/orange accents.

### 16.2 Visual direction

- Kodaikanal mist, forests, stillness and spaciousness.
- Avoid generic corporate-handshake photography.
- Avoid overly religious or commercial yoga imagery.
- Show founders as thoughtful adults, not staged “startup hustle” stereotypes.
- Maintain calm pacing and generous whitespace.

### 16.3 Accessibility

- Meet WCAG 2.2 AA where practical.
- Full keyboard support.
- Visible focus states.
- Semantic headings.
- Accessible labels and error descriptions.
- Minimum target size suitable for mobile.
- Colour contrast must not depend on brand orange alone.
- Respect reduced-motion preferences.
- Provide meaningful alt text.

---

## 17. Performance and Reliability

- Target Core Web Vitals at the 75th percentile:
  - LCP under 2.5 seconds.
  - INP under 200 milliseconds.
  - CLS under 0.1.
- Optimise and responsively serve all images.
- Avoid autoplay video.
- Server-render critical event details.
- Defer nonessential analytics.
- Maintain form usability on slow mobile networks.
- Show retry-safe error states.
- Do not lose entered data on a transient submission error.
- Monitor API errors and failed transactional messages without logging PII.

---

## 18. Analytics

Use consent-first analytics.

Track:

- `retreat_page_view`
- `retreat_apply_click`
- `retreat_form_start`
- `retreat_form_step_complete`
- `retreat_application_submit`
- `retreat_application_success`
- `retreat_application_error`
- `retreat_schedule_expand`
- `retreat_faq_expand`

Properties may include:

- Retreat slug.
- Form step.
- Device class.
- UTM campaign.
- Error category.

Never send:

- Name.
- Email.
- Phone.
- LinkedIn URL.
- Company name.
- Free-text answers.
- Application code.
- Payment status or reference.

Store UTM values in the application record separately for internal attribution.

---

## 19. Error, Empty and Capacity States

### 19.1 Submission error

> We couldn't submit your application. Your answers are still here. Please check your connection and try again.

Provide a support contact after repeated failure.

### 19.2 Applications closed

Replace the form with:

> Applications for this retreat are currently closed. Join the Founder Being list to hear about future gatherings.

Marketing signup requires separate consent.

### 19.3 Capacity reached

Allow the admin to switch to a waitlist form:

> The initial 15 places are currently allocated. You may still apply to join the waitlist.

Do not imply that a waitlist application is a confirmed seat.

### 19.4 Postponed/cancelled

Display an honest status banner and update structured data. Do not silently remove the page.

---

## 20. Internal Financial Model — Never Public

### 20.1 Base scenario

Assumptions:

- 15 paying founders.
- Jimmy as host.
- Anjaan as facilitator.
- 17 people on site.
- Nine rooms for five nights.
- Anjaan honorarium of ₹40,000.

| Cost | Estimate |
|---|---:|
| Traveller, driver, permits and tolls | ₹45,000 |
| Resort rooms | ₹2,92,500 |
| Meals and refreshments | ₹1,32,250 |
| Anjaan honorarium | ₹40,000 |
| Indoor hall | ₹20,000 |
| Yoga mats and props | ₹12,000 |
| Retreat kits | ₹15,000 |
| Photography/content | ₹20,000 |
| First aid/basic group cover | ₹7,000 |
| Marketing/admin | ₹12,000 |
| Pre-contingency cost | ₹5,95,750 |
| 10% contingency | ₹59,575 |
| **Estimated total** | **₹6,55,325** |

Recommended mixed pricing:

- Five × ₹54,500 = ₹2,72,500.
- Ten × ₹57,500 = ₹5,75,000.
- Gross revenue = ₹8,47,500.
- Manual UPI/bank transfer gateway cost assumed at ₹0.
- Estimated operating profit before tax = **₹1,92,175**.

If an online gateway is added later at approximately 2.5%, projected profit reduces by approximately ₹21,188.

### 20.2 Co-host accommodation checkpoint

If Jithin also attends and Anjaan is given a private room:

- Total onsite people become 18.
- Ten rooms may be required rather than nine.
- Extra room, food and contingency may add approximately ₹40,000–₹45,000.
- Total working cost may rise to approximately ₹6.95–₹7.00 lakh.
- Expected profit at full mixed pricing may reduce to approximately ₹1.48–₹1.53 lakh before tax.
- A 20-seat traveller may become tight for 18 guests, the driver and six-day luggage; obtain a vehicle with a luggage carrier or quote a 21/26-seat vehicle.

This decision must be made before the resort and traveller are contracted.

### 20.3 Financial controls

- Public site never displays cost or profit.
- No resort or facilitator advance until authority and cancellation terms are documented.
- Maintain a minimum 12 paid-founder threshold.
- Reforecast room and food costs immediately if capacity changes.
- Record every manual payment and refund.
- Obtain written vendor quotes including taxes, inclusions and cancellation terms.
- Confirm the correct tax/GST treatment before taking payments.

---

## 21. Launch and Operations Timeline

| Date | Milestone |
|---|---|
| 25 July | Approve PRD, pricing, form and policies |
| 26–27 July | Build page, database and admin workflow |
| 28 July | QA, security and mobile testing |
| 29 July | Target public launch |
| 2 August | Proposed first-round application cutoff |
| 3 August | Contact selected founders by phone/WhatsApp |
| 8 August | Target minimum 12 deposits |
| 10 August | Final go/no-go; confirm Anjaan and pay agreed advance |
| 14 August | Collect remaining balances |
| 15–20 August | Rooming, dietary, travel and programme confirmations |
| 21 August | Send final participant pack |
| 26 August | Depart Kochi |
| 31 August | Return to Kochi |

All operational dates should be editable in the admin configuration.

---

## 22. MVP Acceptance Criteria

The MVP is complete only when:

### Public page

- All event information renders correctly on mobile and desktop.
- Exact venue remains hidden until approved.
- Anjaan's profile can be shown/hidden using an admin flag.
- Pricing and availability come from configuration.
- All CTAs lead to the application form.
- SEO metadata and Event structured data validate.

### Application

- Required fields validate on client and server.
- Phone numbers are stored in E.164 format.
- Duplicate email/phone applications are safely handled.
- Turnstile is verified server-side.
- Double-click/retry does not create duplicate records.
- Successful application creates a reference code.
- Applicant receives a confirmation message.
- No payment details are requested.

### Admin

- Only authorised admins can access applications.
- Owners can review, shortlist, select, waitlist and reject.
- Finance can record deposit, balance and refund transactions.
- Application and payment history is auditable.
- Dashboard accurately shows capacity, minimum cohort and amounts.
- The system warns before paid seats exceed 15.
- Selected founders not contacted by 3 August are visible as exceptions.

### Security/privacy

- RLS is enabled and tested on every table.
- Anonymous users cannot read application data.
- Service keys are server-only.
- Storage proofs are private.
- Logs and analytics contain no applicant PII.
- Privacy, terms and wellbeing disclaimers are visible.

### QA

- Tested on current Chrome, Safari, Firefox and mobile Safari/Chrome.
- Keyboard-only form completion works.
- Slow-network and failed-submission recovery works.
- Closed, waitlist, postponed and cancelled states are tested.
- Database backup and production environment variables are confirmed.

---

## 23. Decisions Required Before Public Launch

1. Confirm whether Jithin will attend as a co-host.
2. Confirm whether Anjaan receives a private room.
3. Obtain Anjaan's written availability and permission to announce.
4. Approve the ₹15,000 deposit and 14 August balance deadline.
5. Confirm tax/GST wording with the accountant.
6. Approve the cancellation and transfer policy.
7. Select the resort and confirm the private indoor hall.
8. Confirm whether the 20-seat traveller has adequate luggage capacity.
9. Approve the privacy notice and data-retention periods.
10. Confirm the official phone number and bank/UPI account used for collection.

---

## 24. Post-MVP Enhancements

- Razorpay or another payment gateway.
- Automated payment reconciliation.
- Applicant self-service status page.
- Secure participant portal.
- Automated WhatsApp reminders with consent.
- Roommate and transport allocation.
- Digital waiver/e-signature.
- Calendar and packing-list automation.
- Referral codes.
- Retreat feedback and NPS.
- Reusable multi-retreat CMS and application system.

