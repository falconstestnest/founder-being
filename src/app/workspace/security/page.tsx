import { redirect } from "next/navigation";

/** Legacy path → canonical MFA setup */
export default function WorkspaceSecurityRedirect() {
  redirect("/security/setup");
}
