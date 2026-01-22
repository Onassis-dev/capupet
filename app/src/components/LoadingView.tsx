import { Loader2 } from "lucide-react";

export const LoadingView = () => {
  return (
    <div className="flex justify-center items-center bg-dashboardbg w-full h-screen">
      <Loader2 className="size-16 animate-spin" strokeWidth={1.2} />
    </div>
  );
};
