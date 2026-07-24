import { redirect } from "next/navigation";

/** Legacy admin login → institutional Sign In */
export default function LegacyAdminLoginPage() {
  redirect("/login");
}
