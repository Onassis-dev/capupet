import { toast } from 'sonner';
import { CircleCheck, CircleX } from 'lucide-react';

export const showError = (err: unknown) => {
  toast.custom(() => <Toast message={getMessage(err)} type="error" />);
};

export const showSuccess = (message: string) => {
  toast.custom(() => <Toast message={message} type="success" />);
};

function getMessage(obj: unknown): string {
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'object' && obj !== null) {
    if ('message' in obj && typeof obj.message === 'string') return obj.message;
    if ('response' in obj) {
      const response = obj.response as { data?: { message?: string } };
      if (response.data?.message) return response.data.message;
    }
  }
  return 'Error';
}

function Toast({
  message,
  type,
}: {
  message: string;
  type: 'success' | 'error';
}) {
  return (
    <div className="border rounded-xl shadow-sm grid grid-cols-[1.25rem_1fr] items-center gap-3 p-4 w-full sm:w-80 bg-background">
      {type === 'success' && (
        <CircleCheck className="size-5 text-green-500" strokeWidth={1.8} />
      )}
      {type === 'error' && (
        <CircleX className="size-5 text-red-500" strokeWidth={1.8} />
      )}

      <span className="text-sm mb-px">{message}</span>
    </div>
  );
}
