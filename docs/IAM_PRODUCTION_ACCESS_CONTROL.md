# IAM — Production Access Control

**Status:** Phase 1 in progress — design-complete & architecture-ready, **not production-secure until gates pass**  
**Last verified:** 2026-07-25  

Related: [IAM Team & Access PRD](./IAM_TEAM_ACCESS_PRD.md)

---

## Critical principle

The console is **design-complete and architecture-ready—not production-secure yet** until authentication, authorization, and auditability are fully enforced.

`/admin` must never be treated as open. Unauthenticated users are redirected to `/admin/login`.

---

## Phase 1 — Production access control (this release)

### Authentication (Supabase Auth)

Supported flows:

* Email and password  
* Google sign-in  
* Magic link  
* Password recovery (Supabase dashboard / recovery email)  
* Email verification (project setting)  
* Auth callback: `/admin/auth/callback`  
* Sign out: `/admin/logout`  

### Route protection

Middleware (`src/middleware.ts`):

* All `/admin/*` require a valid session  
* Exceptions: `/admin/login`, `/admin/auth/callback`  
* Without Supabase env: redirect to login with `auth_not_configured`  

### Authorization chain

```text
User is authenticated
        ↓
Profile is active
        ↓
System role is assigned
        ↓
Permission check passes
        ↓
Action allowed
```

Implemented in `src/lib/iam/authz.ts` via `requireAuthz(permission)`.

**Never rely only on hiding buttons.** Every IAM API enforces `requireAuthz` independently.

### Removed insecure patterns

* Email matching alone does **not** grant Super Administrator  
* Invite / approve APIs no longer accept `actorEmail` as proof of authority  
* Local `.data/` IAM store is **disabled in production** (`allowLocalIamFallback()`)

---

## Super Administrator bootstrap

| Field | Value |
| ----- | ----- |
| Name | Jimmy James |
| Email | jimmymanalel@gmail.com |
| Role | Super Administrator |
| Status | Active |
| Protected | true |

Created only via database migration / server bootstrap (`supabase/migrations/*iam*`), then linked to `auth.users` on first successful login by matching the existing **profile row**, not by elevating any email at runtime.

Rules (product + code):

* Cannot be deleted via UI  
* Cannot be deactivated via UI  
* Role cannot be downgraded via UI  
* Always ≥1 active Super Administrator  
* Ownership transfer requires re-auth + MFA (Phase 2+)  

---

## Role model correction

### Institutional relationship (who they are)

Co-Founder · Founding Team Member · Patron · Member · Volunteer · Advisor · Guest  

### System access role (what they can do in CMS)

Super Administrator · Administrator · Programme Manager · Reviewer · Finance · Content Editor · Communications · Read Only · No CMS access  

Example:

```text
Relationship: Patron
System role: No CMS access
```

or

```text
Relationship: Founding Team Member
System role: Programme Manager
```

---

## Invitation workflow (target)

```text
Admin creates invitation
  → Role + department assigned
  → Single-use expiring token (72h)
  → Token stored as SHA-256 hash
  → Email sent (provider TBD)
  → Recipient authenticates
  → Token verified server-side
  → Membership activated
  → Audit event recorded
```

---

## Access request workflow

Public `/access` remains a **request form**, not registration.

Statuses: `submitted` → `under_review` → `approved` | `rejected` | `withdrawn` | `expired`

Approval requires final system role, optional department, note, approver, timestamp. Preferred roles are stored separately and never auto-granted.

---

## Production release gate

Do **not** declare IAM production-ready until:

| Gate | Status |
| ---- | ------ |
| `/admin` redirects unauthenticated users to login | Implemented (middleware) |
| Every API / server action checks permissions | IAM APIs yes; expand to all admin APIs |
| Email matching cannot grant access | Implemented |
| Super Admin bootstrap is database-backed | Migration seed |
| Invitations signed/hashed, expiring, single-use | Hash + 72h; accept activation TBD |
| Access requests never grant roles automatically | Implemented |
| MFA for privileged roles | Pending Supabase MFA enrollment UI |
| Role changes invalidate sessions where required | Pending |
| Audit events immutable | Table + writers; UI pending |
| Anonymous users cannot query IAM tables | RLS enabled; test required |
| RLS tested for every role | Pending |
| Local `.data/` fallback disabled in production | Implemented |
| No production secrets in the browser | Publishable key only on client |

---

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPER_ADMIN_EMAIL=jimmymanalel@gmail.com

# Development only — never in production
# ALLOW_LOCAL_IAM=1
```

---

## Key paths

| Concern | Path |
| ------- | ---- |
| Middleware | `src/middleware.ts` |
| Authz | `src/lib/iam/authz.ts` |
| Roles | `src/lib/iam/roles.ts` |
| Login | `src/app/admin/login` |
| Auth callback | `src/app/admin/auth/callback` |
| Migrations | `supabase/migrations/*iam*` |
