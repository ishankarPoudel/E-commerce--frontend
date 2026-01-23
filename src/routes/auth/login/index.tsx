import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import Login from "@/ui/pages/Auth/Login";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<
    "login" | "loading" | "error" | "success"
  >("login");

  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get("success");
  const error = urlParams.get("error");

  useEffect(() => {
    if (success === "oauth_success") {
      setCurrentState("loading");

      // Smooth progress animation
      const duration = 2000; // 2 seconds total
      const steps = 60;
      const increment = 100 / steps;
      let currentProgress = 0;

      const progressInterval = setInterval(() => {
        currentProgress += increment;
        setProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          setCurrentState("success");

          // Navigate after brief success display
          setTimeout(() => {
            navigate({ to: "/" });
          }, 800);
        }
      }, duration / steps);

      return () => clearInterval(progressInterval);
    } else if (error === "oauth_failed") {
      setCurrentState("error");
    }
  }, [success, error, navigate]);

  // Loading state - Logo + Progress Bar (Production Style)
  if (currentState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Logo and Loader Container */}
        <div className="text-center space-y-8">
          {/* Your Logo/Brand */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Replace with your actual logo */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>

              {/* Pulsing ring around logo */}
              <div className="absolute inset-0 rounded-2xl border-4 border-blue-500/20 animate-ping" />
            </div>
          </div>

          {/* Brand Name */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Avisekh Bag Pasal
            </h1>
            <p className="text-slate-600 text-sm">Signing you in...</p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - Brief celebration
  if (currentState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-slate-600">Taking you to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (currentState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 px-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                Authentication Failed
              </h2>
              <p className="text-slate-600">
                We couldn't complete your sign-in. Please try again.
              </p>
            </div>

            <Button
              onClick={() => {
                window.history.replaceState({}, "", "/auth/login");
                setCurrentState("login");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 h-11"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Login />;
}
