"use client";

import { LoadingView } from "@/components/LoadingView";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isPending } = useSession();

  if (isPending) return <LoadingView />;

  if (!session) {
    router.push("/offline");
    return null;
  }

  if (!session?.user?.verified) {
    router.push("/verify-email");
    return null;
  }

  if (!session?.user?.orgName) {
    router.push("/onboarding");
    return null;
  }

  return <>{children}</>;
}
