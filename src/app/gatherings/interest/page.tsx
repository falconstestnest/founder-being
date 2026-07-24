import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ event?: string }>;
};

/** Legacy route — permanent redirect to Events interest form */
export default async function LegacyGatheringInterestPage({
  searchParams,
}: PageProps) {
  const { event } = await searchParams;
  const q = event ? `?event=${encodeURIComponent(event)}` : "";
  redirect(`/events/interest${q}`);
}
