import { useEffect, useState } from "react";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import Login from "@/ui/pages/Auth/Login";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

const MESSAGES = [
  "Validating your credentials...",
  "Setting up your workspace...",
  "Preparing your dashboard...",
  "Almost ready...",
];

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<
    "login" | "loading" | "error" | "success"
  >("login");

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get("success");
  const error = urlParams.get("error");

  useEffect(() => {
    if (success === "oauth_success") {
      setCurrentState("loading");
      const interval = setInterval(() => {
        setStep((prev) => prev + 1);
      }, 1500);

      const timeout = setTimeout(() => {
        setCurrentState("success");

        navigate({ to: "/" });
        setTimeout(() => {
          // Reset for demo purposes
          setCurrentState("login");
          setStep(0);
        }, 2000);
      }, MESSAGES.length * 1500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else if (error === "oauth_failed") {
      setCurrentState("error");
    }
  }, [success, error]);

  // Loading state
  if (currentState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10" />

        <Card className="w-full max-w-md border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Loading animation container */}
            <div className="relative mb-8">
              <div className="flex justify-center">
                <div className="relative">
                  {/* Outer ring */}
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 absolute inset-0" />
                  {/* Animated ring */}
                  <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin" />
                  {/* Inner glow */}
                  <div className="absolute inset-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {MESSAGES.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      index <= step ? "bg-blue-500 scale-110" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
                Welcome
              </h2>
              <p className="text-lg font-medium text-slate-600 transition-all duration-500 ease-in-out">
                {MESSAGES[step] ?? "✨ Redirecting to your dashboard..."}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                We're setting everything up for you. This will only take a
                moment.
              </p>
            </div>

            {/* Success indicator for final step */}
            {step >= MESSAGES.length - 1 && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-green-600 animate-fade-in">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Ready to go!</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (currentState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50/30 to-indigo-50/50 px-4 relative overflow-hidden">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">
              Welcome!
            </h2>
            <p className="text-slate-600">
              You've been successfully logged in.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (currentState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50/50 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <Card className="w-full max-w-md border-0 shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Error icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* Error message */}
            <div className="space-y-3 mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">
                Authentication Failed
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We couldn't complete your sign-in. Please try again or use a
                different authentication method.
              </p>
            </div>

            {/* Action button */}
            <Button
              onClick={() => {
                window.history.replaceState({}, "", "/auth/login");
                setCurrentState("login");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 transition-colors duration-200"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default login state
  return <Login />;
}
