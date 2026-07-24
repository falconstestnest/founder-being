# Supabase Production Setup — Founder-Being

**Status:** Connection pending  
**Last verified:** 2026-07-25  
**Audience:** Jimmy (project owner) + coding agents  

Related: [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) · [OS_V0_2_1_PRODUCTION_IDENTITY_PERSON_BOOTSTRAP.md](./OS_V0_2_1_PRODUCTION_IDENTITY_PERSON_BOOTSTRAP.md)

---

## Root cause of “Supabase is not configured”

The live login UI and middleware require **browser-safe** Supabase env vars.  
As of the last Vercel audit, the project **`founder-being`** has only:

| Variable | Environments |
| -------- | ------------ |
| `SUPER_ADMIN_EMAIL` | Production, Preview, Development |
| `SUPER_ADMIN_PASSWORD` | Production, Preview, Development |

**Missing (required for auth):**

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Without the first two, `src/lib/supabase/client.ts` throws:

```text
Supabase is not configured.
```

Middleware also returns `configured: false` and sends users to `/login?error=auth_not_configured` (“Secure access is not configured yet…”).

This is **intentional**: no local fallback auth in production.

---

## Exact environment variables (this repository)

### Required names (code-enforced)

| Variable | Scope | Used by |
| -------- | ----- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Client, middleware, server user client, service client |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser + server | Client, middleware, cookie session client |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Profile lookup, people, interest, applications, IAM writes |

### Optional / related

| Variable | Scope | Purpose |
| -------- | ----- | ------- |
| `SUPER_ADMIN_EMAIL` | Server | Documented bootstrap identity (default `jimmymanalel@gmail.com`) — **never** grants access by email alone |
| `SUPER_ADMIN_PASSWORD` | — | **Not used by app code** for auth; do not rely on it. Create the user in Supabase Auth UI |
| `REQUIRE_WORKSPACE_MFA` | Server | Set `1` only after MFA enrollment exists |
| `ALLOW_LOCAL_IAM` | Local only | **Never** set in production |
| `NEXT_PUBLIC_TURNSTILE_*` / `TURNSTILE_SECRET_KEY` | Forms | Retreat spam protection |

### Names this repo does **not** read

Do **not** add only these hoping they work:

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY     ← not referenced
SUPABASE_SECRET_KEY               ← not referenced
SUPABASE_ANON_KEY                 ← not referenced
```

Supabase Dashboard “anon” / “publishable” key → map to **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`**.  
“service_role” / “secret” key → map to **`SUPABASE_SERVICE_ROLE_KEY`**.

**Never** put `SUPABASE_SERVICE_ROLE_KEY` in client code, `NEXT_PUBLIC_*`, screenshots, chat, or git.

---

## Client / server separation (audit result)

| File | Key used | Safe? |
| ---- | -------- | ----- |
| `src/lib/supabase/client.ts` | URL + **PUBLISHABLE** | ✅ Browser |
| `src/lib/supabase/middleware.ts` | URL + **PUBLISHABLE** | ✅ Edge/middleware |
| `src/lib/supabase/server.ts` → `createSupabaseServerClient` | URL + **PUBLISHABLE** | ✅ User session |
| `src/lib/supabase/server.ts` → `getServiceSupabase` | URL + **SERVICE_ROLE** | ✅ Server only; returns `null` if missing |

No client component imports the service role. Privileged writes go through Route Handlers / server modules with service role.

---

## Manual steps for Jimmy

### A. Supabase project (owner-controlled)

1. Open [Supabase Dashboard](https://supabase.com/dashboard).  
2. If no Founder-Being project exists, **create manually**:

```text
Name: Founder-Being Production
Region: nearest Asia (India-focused ops)
```

3. **Do not** ask an agent to create a second production project.  
4. Save privately: DB password, project ref, URL, publishable key, service-role key.

### B. Vercel environment variables

```text
Vercel → founder-being → Settings → Environment Variables
```

Add for **Production** (and Preview/Development when ready):

```text
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon/publishable key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
```

| Environment | Recommendation |
| ----------- | -------------- |
| Production | Production Supabase project only |
| Preview | Prefer a separate **staging** Supabase project later; until then, avoid writing real PII |
| Development | Local `.env.local` (same names); never commit |

### C. Redeploy

Env changes do **not** apply to an already-built deployment.

```text
Vercel → Deployments → … → Redeploy
```

Then hard-refresh `https://www.foundrbeing.com/login`.

### D. Auth redirect URLs (Supabase Auth)

In Supabase → Authentication → URL configuration:

**Site URL**

```text
https://www.foundrbeing.com
```

**Redirect URLs** (allow list)

```text
https://www.foundrbeing.com/login/callback
https://www.foundrbeing.com/**
http://localhost:3000/login/callback
http://localhost:3000/**
```

App post-auth flow:

```text
/login → /login/callback → /workspace → role home
```

Password recovery:

```text
/login/forgot-password → email → /login/callback?next=/login/reset-password → /login/reset-password
```

### E. Google OAuth (optional)

Supabase → Auth → Providers → Google:

* Enable Google  
* Client ID / secret from Google Cloud  
* Authorized redirect URI = Supabase callback (shown in dashboard), **not** only foundrbeing.com  

App redirect after OAuth still goes to:

```text
https://www.foundrbeing.com/login/callback
```

### F. Magic link / email

* Configure SMTP or Supabase default email (rate limits apply).  
* Magic link `emailRedirectTo` points at `/login/callback`.  
* Confirm “Confirm email” settings match your bootstrap needs (Super Admin may need email confirmed).

### G. Super Administrator bootstrap

**Do not** insert into `auth.users` via SQL.

1. Supabase Auth → Users → **Add user**  
   - Email: `jimmymanalel@gmail.com`  
   - Set password or send invite  
   - Confirm email if required  
2. Apply IAM SQL migrations (below) so `profiles` seed exists.  
3. First successful sign-in links `profiles.auth_user_id` and creates/links `people`.  
4. Runtime **never** grants Super Admin by email string match.

---

## Database: tables the code expects

| App concept | Actual table |
| ----------- | ------------ |
| Auth users | `auth.users` (Supabase-managed) |
| Access identity | `profiles` |
| Canonical human | `people` |
| System roles | `roles` (not `system_roles`) |
| Role assignments | `user_roles` |
| Access requests | `access_requests` |
| Audit | `audit_logs`, `person_migration_audit` |
| Event interest | `gathering_interest` (+ `person_id` after v0.2.1) |
| Retreat applications | `retreat_applications` (+ `person_id` after v0.2.1) |
| Events ops | `events`, `event_participation`, `event_lifecycle_audit` |

---

## Migration sequence (apply manually; review first)

**Order** (SQL editor or CLI against **this** project only):

| # | File | Purpose |
| - | ---- | ------- |
| 1 | `20260725_retreat_platform.sql` | Retreats, applications, legacy `admin_profiles` |
| 2 | `20260726_iam_team_access.sql` | `profiles`, `roles`, `user_roles`, invites, access requests, audit |
| 3 | `20260726_iam_phase1_access_control.sql` | Relationship slug, Super Admin seed, role expansions |
| 4 | `20260726_gathering_interest.sql` | Public event interest |
| 5 | `20260726_event_operations.sql` | Events ops tables |
| 6 | `20260726_v0_2_1_people_bootstrap.sql` | `people`, links, backfill, RLS |

**Agents must not** run destructive migrations automatically or against an unknown project.

Login can **authenticate** after env + Auth user exist, **before** all migrations.  
Workspace / admin need `profiles` + roles.  
Person graph needs migration #6.

---

## What works after env only (before full IAM)

| Path | Expected |
| ---- | -------- |
| Password / magic / Google attempt | Client no longer throws “not configured” |
| Wrong password | Supabase error message |
| User missing | Supabase error |
| Success but no profile | `/access/pending` or role_missing outcomes |
| Success + active Super Admin profile | `/workspace` → `/admin` |

---

## Production readiness checklist (not “secure” until all pass)

- [ ] Supabase project owned by Jimmy  
- [ ] Three env vars on Vercel Production + redeploy  
- [ ] Redirect URLs configured  
- [ ] Migrations 1–6 applied and tables verified  
- [ ] Super Admin Auth user + active protected profile + role  
- [ ] MFA for privileged roles  
- [ ] RLS matrix tested  
- [ ] Session revoke on suspend  
- [ ] Audit on access-sensitive actions  
- [ ] No `ALLOW_LOCAL_IAM` in production  
- [ ] No real PII until security gate (Phase 1) complete  

**Do not** mark production-secure until the gate in `IAM_PRODUCTION_ACCESS_CONTROL.md` and `OS_V0_2_SECURE_PEOPLE_FOUNDATION.md` is green.

---

## Agent rules (permanent)

1. Do **not** create another Supabase project without explicit owner instruction after dashboard check.  
2. Do **not** print, commit, or log service-role keys, DB passwords, or tokens.  
3. Use environment variables only.  
4. Treat production DB as production; no preview/prod data mix.  
5. Security gate before CRM, timeline, communications, finance, documents, automation, AI.  

---

## Short report for operators

| Item | Status |
| ---- | ------ |
| Supabase connection | **Not configured** on Vercel (missing URL + keys) |
| Env vars required | See table above |
| Existing tables on remote | **Unknown** until project + migrations applied |
| Migrations pending | All six files above (if empty project) |
| Auth providers | Configure Email (+ Google optional) after project exists |
| Redirect URLs | `/login/callback`, site URL `https://www.foundrbeing.com` |
| RLS | Defined in migrations; not live until applied |
| Super Admin bootstrap | Seed SQL ready; Auth user must be created manually |
| Blocker | Add env vars + redeploy; then Auth user + migrations |

### Jimmy’s next actions (exact)

1. Confirm or create **Founder-Being Production** in Supabase Dashboard.  
2. Copy Project URL + publishable key + service_role key (keep secret offline).  
3. Add the three variables to Vercel Production.  
4. Redeploy.  
5. Configure Auth redirect URLs.  
6. Create Auth user `jimmymanalel@gmail.com`.  
7. Review and apply migrations in order.  
8. Sign in at `/login` → expect `/workspace` → `/admin` when profile+role present.  
9. Reply to the agent: *“Production Supabase project exists; env vars added to Vercel”* (no secrets in chat).  
