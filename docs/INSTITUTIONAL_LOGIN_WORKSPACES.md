# Institutional Login & Personalized Dashboards

**Status:** Workspace resolver live · `/workspace` entry  
**Last verified:** 2026-07-25  

Language: **Sign In** (not Admin Login). One secure gateway for founders, patrons, volunteers, reviewers, programme staff and administrators.

---

## Public entry

**Route:** `/login`  

Footer (landing):

> Already part of the Founder-Being community?  
> Access your workspace…  
> **[ Sign In ]**  
> Secure access for members, patrons, volunteers, reviewers and the Founder-Being team.

---

## Authentication flow

```text
Sign In
  → Authentication (Supabase)
  → /workspace   ← stable post-auth hub
  → Active profile
  → Relationship (language / experience)
  → System role (access)
  → Authorized workspace
```

The user **never chooses** a dashboard. Relationship influences language and experience; system role controls access.

---

## Stable post-auth target: `/workspace`

All of these land on `/workspace` first (except password recovery form):

* password sign-in  
* magic-link callback  
* Google OAuth  
* password-reset completion (after new password)  
* expired-session recovery  

```text
/login → /workspace → resolver → role-specific destination
```

Password recovery is separate:

```text
/login/forgot-password → email → /login/callback → /login/reset-password → /workspace
```

Do **not** embed role-specific routes in authentication logic.

Email deep-links may pass `?next=/programme/...`; `/workspace` validates that `next` is under the authorized workspace (super admin may deep-link for support).

---

## Resolver states and dedicated outcomes

Implementation: `src/lib/iam/workspaceSession.ts` · `outcomePathForState()`

| State | Outcome route |
| ----- | ------------- |
| `authenticated_and_authorized` | Assigned workspace path |
| `unauthenticated` | `/login` |
| `profile_missing` / `profile_inactive` / `role_missing` | `/access/pending` |
| `mfa_required` | `/security/setup` (`REQUIRE_WORKSPACE_MFA=1`) |
| `access_suspended` | `/forbidden?reason=suspended` |
| Permission denied | `/forbidden` |
| Wrong workspace | One hop to assigned home |
| `configuration_missing` | `/login?error=auth_not_configured` |

No bounce loops between middleware and `/workspace`.

---

## Security rule (critical)

**The workspace resolver is not the security boundary.**

`GET /api/auth/workspace` is a routing helper only.

Each of these must enforce authorization independently:

* workspace routes (`requireWorkspace`)  
* server actions  
* API endpoints (`requireAuthz`)  
* data queries  

Example:

```text
/programme
  → authenticated
  → active profile
  → programme.view (when permission check applied)
  → allow
```

A user who manually visits another route is redirected to their home or `/workspace` — not merely shown a hidden sidebar.

---

## Workspace routing

| Audience | Path | Purpose |
| -------- | ---- | ------- |
| Super Administrator | `/admin` | System admin, security, audit, ops oversight |
| Administrator / Executive | `/executive` | Institution-wide attention |
| Programme Manager | `/programme` | Event operations, participation, tasks |
| Reviewer | `/review` | Assigned applications only |
| Finance | `/finance` | Payments / refunds (no unrestricted reflection answers) |
| Communications | `/communications` | Campaigns and messages |
| Volunteer | `/volunteer` | Assigned events / shifts (event-scoped) |
| Patron | `/patron` | Impact, gatherings, meetings (no unapproved finance ops) |
| Founder / Member | `/founder` · `/member` | Personal events, applications, resources |

Resolution: `resolveWorkspace()` · session: `resolveWorkspaceSession()` · guards: `requireWorkspace()`

---

## Workspace content rules

| Workspace | Show | Avoid |
| --------- | ---- | ----- |
| Founder / Member | Events, applications, invitations, past participation, resources, messages, profile | Operational / community-wide ops data |
| Patron | Supported programmes, impact, gatherings, reports, meetings, correspondence | Operational financial data unless approved |
| Volunteer | Assigned events, shifts, contacts, documents, tasks | Unscoped institution data |
| Reviewer | Assigned applications; notes / decisions / COI separated | Unassigned applications |
| Finance | Payment and refund workflows | Sensitive reflection answers / programme notes |
| Programme | Events, participation, communications, tasks, timelines | Infrastructure secrets |
| Executive | Attention queues, people, events, patrons, reporting | Infrastructure secrets |
| Super Admin | System admin, access, security, audit, integrations | — |

---

## Workspace shell

Shared chrome (`WorkspaceShell`):

```text
Good morning, Jimmy.
Here is what needs your attention today.
```

Header controls: search · notifications · help · profile (sign out).

**Role names are not status symbols.** Role appears discreetly in the profile menu only.

---

## Logout

`POST /admin/logout` terminates the session and returns to `/login`.

---

## Acceptance criteria

| Criterion | Status |
| --------- | ------ |
| Login always resolves through `/workspace` | ✅ |
| Users cannot choose or manipulate workspace | ✅ Resolver only |
| Every route re-checks session (`requireWorkspace`) | ✅ Shell |
| Inactive / roleless explicit states | ✅ |
| Privileged MFA block when `REQUIRE_WORKSPACE_MFA=1` | ✅ Soft until v0.2 enrollment |
| Suspended → no authorized workspace | ✅ |
| Relationship never grants CMS access alone | ✅ `getAuthzContext` / permissions separate |
| Role changes take effect on next request | ✅ Session reloaded each request |
| Nav from workspace definition (permission-aware later) | ✅ Partial |
| Unauthorized → redirect /workspace or home | ✅ |
| Logout → session end → `/login` | ✅ |
| No production local IAM fallback | ✅ Middleware + store rules |

---

## Implementation map

| Piece | Path |
| ----- | ---- |
| Sign In UI | `src/app/login/page.tsx` |
| OAuth/magic callback | `src/app/login/callback` |
| **Post-auth hub** | `src/app/workspace/page.tsx` |
| MFA setup shell | `src/app/workspace/security` |
| Session resolver | `src/lib/iam/workspaceSession.ts` |
| Workspace map | `src/lib/iam/workspaces.ts` |
| Route guards | `src/lib/workspace/guard.ts` |
| Routing API (not security) | `GET /api/auth/workspace` |
| Shell | `src/components/workspace/*` |
| Middleware | `src/middleware.ts` |

Related: [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) · [OS_V0_2_SECURE_PEOPLE_FOUNDATION.md](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md) · [INSTITUTION_OS_PHASE2.md](./INSTITUTION_OS_PHASE2.md)
