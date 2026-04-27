import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";

type ToastAgentSuccessOptions = {
  title: string;
  description: string;
  actionLabel: string;
  /** Called when the user clicks the action button */
  onAction: () => void;
};

/**
 * Styled success toast for AI generation jobs.
 * Shows a title, description, and a link button (e.g. "View my recipes →").
 */
export function toastAgentSuccess({
  title,
  description,
  actionLabel,
  onAction,
}: ToastAgentSuccessOptions) {
  const id = toast.custom(
    () => (
      <div className="flex gap-3 w-full rounded-xl border border-green-300/60 bg-green-100 px-4 py-3.5 shadow-lg shadow-green-200/40">
        {/* Icon — checkmark circle */}
        <div className="mt-0.5 shrink-0 text-green-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-900 leading-snug">
            {title}
          </p>
          <p className="text-sm text-green-700 leading-snug">{description}</p>
          <button
            onClick={() => {
              toast.dismiss(id);
              onAction();
            }}
            className="mt-1 w-full rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 px-4 transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    ),
    { duration: 6000 },
  );
}

type HandleAgentErrorOptions = {
  /** Generic fallback message when it's not a limit error */
  fallbackMessage: string;
  /** Called when the user clicks "Upgrade plan" — use router.push("/pricing") */
  onUpgrade: () => void;
};

/**
 * Handles tRPC errors from AI generation mutations.
 *
 * - FORBIDDEN (limit exceeded): shows a styled toast with an upgrade CTA below the text
 * - Everything else: shows the generic fallback error toast
 */
export function handleAgentError(
  error: unknown,
  { fallbackMessage, onUpgrade }: HandleAgentErrorOptions,
) {
  if (error instanceof TRPCClientError && error.data?.code === "FORBIDDEN") {
    // Unique class lets us find this specific toast in the DOM
    const toastClass = `limit-toast-${Date.now()}`;
    const id = toast.custom(
      () => (
        <div
          className={`${toastClass} flex gap-3 w-full rounded-xl border border-red-300/60 bg-red-100 px-4 py-3.5 shadow-lg shadow-red-200/40`}
        >
          {/* Icon */}
          <div className="mt-0.5 shrink-0 text-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-900 leading-snug">
              You&apos;ve hit your monthly limit
            </p>
            <p className="text-sm text-red-700 leading-snug">{error.message}</p>
            <button
              onClick={() => {
                toast.dismiss(id);
                onUpgrade();
              }}
              className="mt-1 w-full rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold py-2 px-4 transition-colors cursor-pointer"
            >
              Upgrade plan →
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );

    // Dismiss when the user clicks anywhere outside the toast
    const handleOutsideClick = (e: MouseEvent) => {
      const toastEl = document.querySelector(`.${toastClass}`);
      if (!toastEl || !toastEl.contains(e.target as Node)) {
        toast.dismiss(id);
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };

    // Small delay so the current click that triggered the toast doesn't
    // immediately dismiss it
    setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 100);

    // Always clean up after the toast auto-expires
    setTimeout(() => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }, 10100);

    return;
  }

  toast.error(fallbackMessage);
}
