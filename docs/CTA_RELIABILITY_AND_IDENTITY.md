# CTA Reliability and Identity Linking

**Status:** Structural foundation  
**Last verified:** 2026-07-25  
**Milestone:** Make every public or authenticated action complete end-to-end with clear failure states

Related: [INSTITUTIONAL_LOGIN_WORKSPACES.md](./INSTITUTIONAL_LOGIN_WORKSPACES.md) · [OS_V0_2_SECURE_PEOPLE_FOUNDATION.md](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md) · [EVENTS_DOMAIN.md](./EVENTS_DOMAIN.md)

---

## Three journeys (do not conflate)

| Journey | Entry | Outcome |
| ------- | ----- | ------- |
| **Sign In** | `/login` | Authenticated user → `/workspace` → assigned home |
| **Request access** | `/access` | Request only — no account, no role |
| **Public event actions** | `/events`, forms | Interest / application without login |

---

## Auth routes

```text
/login
/login/callback
/login/forgot-password   ← password recovery (not magic link)
/login/reset-password
/workspace               ← sole post-auth hub
/access
/access/pending
/security/setup
/forbidden
```

### Password recovery vs magic link

| Flow | Purpose |
| ---- | ------- |
| Magic link | Passwordless sign-in |
| Forgot password | Secure reset email → choose new password |

Copy: *Forgot your password? Enter your email and we’ll send you a secure reset link.*

---

## Post-auth outcomes (no redirect loops)

```text
Unauthenticated           → /login
Authenticated + inactive  → /access/pending
Authenticated + MFA need  → /security/setup
Authenticated + wrong WS  → assigned home (one hop)
Authenticated + 403       → /forbidden
Suspended                 → /forbidden?reason=suspended
```

`/workspace` resolves once and redirects — it does not bounce with middleware.

---

## Portal entitlement vs system permission

```text
Portal entitlement          System permission
─────────────────           ─────────────────
patron.portal               applications.review
founder.portal              payments.manage
volunteer.portal            users.assign
member.portal               events.manage
```

Relationship alone never unlocks CMS. Code: `src/lib/iam/portalEntitlements.ts`

---

## CTA analytics taxonomy

```text
cta_clicked | cta_started | cta_submitted | cta_completed | cta_failed
```

Dimensions: `cta_name`, `source_page`, `event_id`, `event_type`, `registration_workflow`, `authenticated`, `workspace`

Client: `trackCta()` · Sink: `POST /api/analytics/cta`

---

## Identity linking (public form → later sign-in)

Match on (never name alone):

1. Authenticated user ID  
2. Verified / normalized email  
3. Normalized WhatsApp  
4. Manual merge for duplicates  

Helpers: `src/lib/identity/normalize.ts`

---

## Request access protections

* Rate limit (in-memory foundation; edge later)  
* Honeypot  
* Duplicate open request → same success (no user enumeration)  
* Privacy consent required  
* Audit on submit (`access_request.submitted`)  
* Approval/rejection audit (Team & Access)  
* Success copy: request received · no account · no access  

---

## Production readiness sequence

1. Configure Supabase Auth + bootstrap Super Administrator  
2. Password recovery + invitation acceptance  
3. `requireAuthz()` on every workspace API / route / server action  
4. MFA for privileged roles (`REQUIRE_WORKSPACE_MFA=1`)  
5. RLS tests by role and portal entitlement  
6. Session revoke on suspension / material role change  
7. Immutable audit logs  
8. Connect real workspace data  
9. E2E tests per CTA journey  
10. **Then** store real applicant, patron, payment, or reflection data  

---

## Acceptance tests (manual / later automated)

| Journey | Expect |
| ------- | ------ |
| Footer Sign In | Auth → profile → correct workspace |
| Request access | Request only · no role · visible in Team & Access |
| Event interest | Preserves `event_id` · workflow metadata · success state |
| Retreat application | Validates steps · one application · no accidental duplicate |
| Wrong workspace | Blocks data · assigned home or `/forbidden` |

---

## Code map

| Piece | Path |
| ----- | ---- |
| Forgot / reset password | `src/app/login/forgot-password`, `reset-password` |
| Workspace hub | `src/app/workspace` |
| Access pending | `src/app/access/pending` |
| MFA setup | `src/app/security/setup` |
| Forbidden | `src/app/forbidden` |
| Portal entitlements | `src/lib/iam/portalEntitlements.ts` |
| Identity normalize | `src/lib/identity/normalize.ts` |
| CTA track | `src/lib/analytics/cta.ts` |
| Rate limit | `src/lib/security/rateLimit.ts` |
