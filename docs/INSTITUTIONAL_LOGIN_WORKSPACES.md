# Institutional Login & Personalized Dashboards

**Status:** Shell implemented · routing model live  
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

```
Sign In
  → Authentication (Supabase)
  → Profile (active)
  → Relationship (institutional)
  → System role
  → Workspace (system-chosen)
  → Dashboard
```

The user **never chooses** a dashboard.

---

## Workspace routing

| Audience | Path | Purpose |
| -------- | ---- | ------- |
| Super Administrator | `/admin` | Institution operations |
| Administrator / Co-Founder (CMS) | `/executive` | Institution health |
| Programme Manager | `/programme` | Programme operations |
| Reviewer | `/review` | Application review only |
| Finance | `/finance` | Financial operations |
| Communications | `/communications` | Community communication |
| Volunteer | `/volunteer` | Event support |
| Patron (relationship) | `/patron` | Patron portal |
| Founder / Member | `/founder` or `/member` | Personal workspace |

Resolution: `src/lib/iam/workspaces.ts` · `GET /api/auth/workspace`

---

## Design principles

* Calm · action-oriented · personalized greeting  
* Empty states: “You’re all caught up…”  
* Same typography tokens and Calm Operations chrome  
* Role-aware sidebar (only relevant modules)  
* AI assistant hooks: future, contextual per workspace  

---

## Implementation map

| Piece | Path |
| ----- | ---- |
| Sign In UI | `src/app/login/page.tsx` |
| OAuth/magic callback | `src/app/login/callback` |
| Workspace resolver | `src/lib/iam/workspaces.ts` |
| Guards | `src/lib/workspace/guard.ts` |
| Shell | `src/components/workspace/*` |
| Middleware | `src/middleware.ts` |

Related: [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) · [INSTITUTION_OS_PHASE2.md](./INSTITUTION_OS_PHASE2.md)
