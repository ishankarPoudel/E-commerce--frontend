import { useEffect, useRef, useState } from "react";

interface EsewaPaymentFormProps {
  formUrl: string;
  params: Record<string, unknown>;
}

export const EsewaPaymentForm = ({
  formUrl,
  params,
}: EsewaPaymentFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const normalizedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (value === undefined || value === null) {
        throw new Error(`Missing eSewa field: ${key}`);
      }
      return [key, String(value)];
    }),
  ) as Record<string, string>;

  useEffect(() => {
    if (!formRef.current || submitted) return;

    const timer = setTimeout(() => {
      formRef.current?.submit();
      setSubmitted(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur-2xl opacity-30 animate-pulse" />
          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-2xl animate-bounce-slow">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-fade-in">
            Connecting to eSewa
          </h2>
          <p className="text-gray-600 dark:text-gray-400 animate-fade-in-delay">
            Securely redirecting you to complete your payment
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce" />
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-progress" />
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-delay-2">
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secured by eSewa</span>
        </div>
      </div>

      {/* Hidden form - untouched */}
      <form ref={formRef} action={formUrl} method="POST" className="hidden">
        {Object.entries(normalizedParams).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} readOnly />
        ))}
      </form>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(400%);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};
