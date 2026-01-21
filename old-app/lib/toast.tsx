import { toast } from "sonner";
import { CircleCheck, CircleX } from "lucide-react";

export const showError = (err: any) => {
  toast.custom(() => <Toast message={getMessage(err)} type="error" />);
};

export const showSuccess = (message: string) => {
  toast.custom(() => <Toast message={message} type="success" />);
};

// extra
function getMessage(obj: any): string {
  if (typeof obj === "string") return obj;
  if (Object.keys(obj).length === 0) return obj.message || "Error";
  if (obj.response) return obj.response.data.message;
  return "Error";
}

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div className="border rounded-xl shadow-sm grid grid-cols-[1.25rem_1fr] items-center gap-3 p-4 w-full sm:w-80 bg-background">
      {type === "success" && (
        <CircleCheck className="size-5 text-green-500" strokeWidth={1.8} />
      )}
      {type === "error" && (
        <CircleX className="size-5 text-red-500" strokeWidth={1.8} />
      )}

      <span className="text-sm mb-px">{message}</span>
    </div>
  );
}
