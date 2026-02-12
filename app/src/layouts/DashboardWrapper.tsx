import { LoadingView } from "@/components/LoadingView";
import { useSession } from "@/hooks/use-session";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      navigate("/offline");
      return;
    }

    console.log(session);
    if (!session?.user?.verified) {
      navigate("/verify-email");
      return;
    }

    if (!session?.user?.orgName) {
      navigate("/onboarding");
      return;
    }
  }, [session, isPending, navigate]);

  if (isPending) return <LoadingView />;

  if (!session || !session?.user?.verified || !session?.user?.orgName) {
    return null;
  }

  return <>{children}</>;
}
