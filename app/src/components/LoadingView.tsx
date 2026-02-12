import { Loader2 } from "lucide-react";

export const LoadingView = () => {
  return (
    <div className="flex justify-center items-center bg-dashboardbg w-full h-screen fixed top-0 left-0 z-50">
      <Loader2 className="size-16 animate-spin" strokeWidth={1.2} />
    </div>
  );
};
