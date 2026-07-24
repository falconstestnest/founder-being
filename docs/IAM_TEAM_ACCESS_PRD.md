# Identity & Access Management (IAM)

## Module Name: Team & Access

**Version:** 1.0  
**Status:** Product & architecture PRD  
**Last verified:** 2026-07-25  

Founder-Being is designed as an institution. Backend access is managed as a first-class **Identity & Access Management (IAM)** module—not a simple “Users” page—so members, patrons, volunteers, reviewers, finance, and future staff share one model as the organisation grows.

---

# Position in Navigation

```
Dashboard
Community
Retreats
Applications
Gatherings
Patrons
Communications
Content
Analytics
--------------------
Team & Access
Settings
```

**Team & Access** is the source of truth for everyone who can access the Founder-Being CMS (and, later, portals).

**Route:** `/admin/team`

---

# Objectives

* Authenticate users  
* Assign roles  
* Control permissions  
* Maintain audit logs  
* Support organisational growth  
* Avoid permission duplication  
* Follow least-privilege principles  

---

# Super Administrator

| Field | Value |
| ----- | ----- |
| Name | Jimmy James |
| Email | `jimmymanalel@gmail.com` |
| Role | Super Administrator |
| Status | Active |

Rules:

* Super Administrator **cannot be removed** through the UI.  
* Only another Super Administrator can deactivate, transfer ownership, or change another Super Administrator.  
* The system must always retain at least one active Super Administrator (no accidental lockout).  

Bootstrap constant: `src/lib/iam/constants.ts` · env `SUPER_ADMIN_EMAIL`.

---

# Role Hierarchy

```
Super Administrator
  → Co-Founder
    → Founding Team
      → Patron
        → Programme Lead
          → Finance
            → Reviewer
              → Operations
                → Volunteer
                  → Member
                    → Guest
```

Higher roles inherit lower permissions unless explicitly denied.

---

# Recommended Roles

| Role | Summary | Key can | Key cannot |
| ---- | ------- | ------- | ---------- |
| **Super Administrator** | Full system access | Everything including billing, auth, roles, secrets, audit | — |
| **Co-Founder** | Operational leadership | Retreats, applications, content, events, communications, patrons, members | Delete Super Admin, change billing owner, rotate production secrets |
| **Founding Team** | Leadership team | Events, founders, review applications, communicate, website content | System settings, permissions, finance settings |
| **Patron** | Not an administrator; future portal | Read-only: patron events, documents, meetings, updates | Manage operations |
| **Programme Lead** | Programmes | Retreats, gatherings, attendees, schedules | Manage users |
| **Finance** | Money only | Payments, refunds, invoices, reports | Edit applications |
| **Reviewer** | Applications only | Review, approve, reject, waitlist, notes | Everything else |
| **Operations** | Logistics | Travel, rooms, participants, communication | Users / system |
| **Volunteer** | Limited | Specific retreat only | Broad CMS |
| **Member** | Portal only | Member experiences | No CMS |
| **Guest** | Invitation-only | Read-only | Manage anything |

---

# Permission Model

**Do not hardcode capabilities only inside UI conditionals.**

```
Role
  → Permission Groups
    → Individual Permissions
```

Example: Co-Founder inherits `applications.*`, `retreats.*`, `events.*`, `communications.*`.  
Super Admin inherits `*`.

### Permission categories

Dashboard · Applications · Retreats · Events · Members · Patrons · Communications · Payments · Reports · Content · Settings · Users · Audit Logs · API  

### Actions per category

View · Create · Edit · Delete · Export · Approve · Publish · Assign  

---

# Access Lifecycle

```
Request access (public)  OR  Invite (admin)
        ↓
Select preferred role(s) at signup / request
        ↓
Pending (Super Admin / authorised approver)
        ↓
Approve + assign final role(s) + department
        ↓
Accept invite / set password / MFA
        ↓
Active access
```

* **Public self-registration into CMS is never open.**  
* Users may **request access** and state preferred roles.  
* Super Administrator (and authorised roles) **approve** and **assign** final access.  

---

# Team List (UI)

**Columns:** Avatar · Name · Email · Role · Status · Last Login · 2FA · Created  

**Filters:** Role · Status · Never Logged In · 2FA Disabled · Last Login  

**Bulk actions:** Deactivate · Invite · Reset Password · Assign Role · Export  

---

# User Profile Tabs

Overview · Permissions · Activity · Sessions · Audit Log · Devices · Security · Notes  

---

# Invite Workflow

Invite → Email → Role → Department → Optional note → Email invite → Accept → Create password → Enable MFA → Login  

**Invitation statuses:** Pending · Accepted · Expired · Revoked · Cancelled  

---

# Authentication

**Now:** Supabase Auth — Password, Google, Magic Link  

**Future:** Microsoft, Apple, GitHub · SSO  

---

# Security

**MFA required for:** Super Admin · Co-Founder · Finance · Founding Team · Programme Lead  

Support: recovery codes · session management · trusted devices  

**Sessions:** current device, browser, location/IP, time · Logout device · Logout all  

**Audit log (immutable):** time · user · action · object · IP · browser — for permission changes, logins, exports, deletions, payments, approvals  

---

# Organisation Structure

Users may belong to one or more departments (filtering / org only—not automatic permissions unless linked):

```
Founder-Being
├── Executive Office
├── Founding Team
├── Retreat Operations
├── Finance
├── Community
├── Marketing
├── Advisory Council
├── Patron Circle
├── Volunteers
```

---

# Design Principles

* **RBAC** — permissions via roles; rare user-level overrides only  
* **Least privilege** — minimum required on join  
* **Auditability** — security-sensitive actions logged, immutable  
* **Separation of duties** — finance ≠ review applications; reviewers ≠ payments; content ≠ system settings  
* **Invite / approve only** — no public admin registration  
* **MFA** for privileged roles  
* **Protected ownership** — always ≥1 active Super Admin  
* **Scalable** — patron/member portals and chapters without redesigning authz  

---

# Database Structure

```
profiles                 -- app user identity (links auth.users)
roles
permissions
role_permissions
user_roles
departments
department_members
user_sessions
audit_logs
invitations
access_requests          -- signup intent + preferred roles
api_tokens               -- future
```

---

# Implementation Map

| Concern | Path |
| ------- | ---- |
| Roles & permission matrix | `src/lib/iam/` |
| Super Admin seed | `src/lib/iam/constants.ts` |
| SQL migration | `supabase/migrations/20260726_iam_team_access.sql` |
| Team & Access UI | `src/app/admin/team/` |
| Access request (public) | `/access` |
| Invite accept | `/access/accept` |
| APIs | `src/app/api/iam/` |

Related: [Admin Dashboard Design PRD](./ADMIN_DASHBOARD_DESIGN_PRD.md) · [Retreat Platform](./RETREAT_PLATFORM_MVP.md)
