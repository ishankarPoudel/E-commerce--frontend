import { loginUserMutation } from "@/api/@tanstack/react-query.gen";
import GoogleIcon from "@/static/GoogleIcon";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Separator } from "@/ui/shadcn/separator";
import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import { getClientInfo } from "@/utils/getClientInfo";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Lock,
  Mail,
  AlertTriangle,
  ShieldAlert,
  XCircle,
  Info,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState<string | null>(null);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Check for error parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error) {
      setErrorType(error);

      // Show toast notification based on error type
      switch (error) {
        case "session_revoked":
          toast.error("Your session has been revoked by an administrator", {
            duration: 5000,
          });
          break;
        case "account_banned":
          toast.error("Your account has been suspended", {
            duration: 5000,
          });
          break;
        case "session_expired":
          toast.warning("Your session has expired", {
            duration: 4000,
          });
          break;
        case "oauth_failed":
          toast.error("OAuth authentication failed", {
            duration: 4000,
          });
          break;
        default:
          toast.error("Authentication error", {
            duration: 4000,
          });
      }

      // Clean URL after showing notification
      window.history.replaceState({}, "", "/auth/login");
    }
  }, []);

  // mutation to handle user login
  const { mutate, isPending: isUserLoginPending } = useMutation({
    ...loginUserMutation(),
  });

  //function to handle user login
  const handleUserLogin = async (data: { email: string; password: string }) => {
    const clientInfo = await getClientInfo();

    mutate(
      {
        body: {
          email: data.email,
          password: data.password,
          os: clientInfo.os,
          browser: clientInfo.browser,
          device: clientInfo.device,
          location: JSON.stringify({
            country: clientInfo.location?.country,
            city: clientInfo.location?.city,
            region: clientInfo.location?.region,
            ip: clientInfo.location?.ip,
            org: clientInfo.location?.org,
          }),
        },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Login successful");
          navigate({
            to: "/",
          });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Login failed");
        },
      }
    );
  };

  // fn to handle oAuth login click
  const handleOauthLoginClick = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  // Get error alert configuration
  const getErrorAlert = () => {
    switch (errorType) {
      case "session_revoked":
        return {
          icon: ShieldAlert,
          variant: "destructive" as const,
          title: "Session Revoked",
          description:
            "For security reasons, an administrator has revoked your session. Please log in again to continue.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconColor: "text-red-600",
        };
      case "account_banned":
        return {
          icon: XCircle,
          variant: "destructive" as const,
          title: "Account Suspended",
          description:
            "Your account has been suspended by an administrator. Please contact support for more information.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconColor: "text-red-600",
        };
      case "session_expired":
        return {
          icon: AlertTriangle,
          variant: "default" as const,
          title: "Session Expired",
          description:
            "Your session has expired due to inactivity. Please log in again to continue.",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          iconColor: "text-amber-600",
        };
      case "oauth_failed":
        return {
          icon: Info,
          variant: "default" as const,
          title: "OAuth Login Failed",
          description:
            "We couldn't complete your Google sign-in. Please try again or use email login below.",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          iconColor: "text-blue-600",
        };
      default:
        return null;
    }
  };

  const errorAlert = getErrorAlert();

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Error Alert Banner */}
          {errorAlert && (
            <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <Alert
                variant={errorAlert.variant}
                className={`${errorAlert.bgColor} ${errorAlert.borderColor} border-2 shadow-lg`}
              >
                <errorAlert.icon
                  className={`h-5 w-5 ${errorAlert.iconColor}`}
                />
                <div className="ml-2">
                  <div className="font-semibold text-slate-900 mb-1">
                    {errorAlert.title}
                  </div>
                  <AlertDescription className="text-slate-700 leading-relaxed">
                    {errorAlert.description}
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {errorType === "session_revoked"
                  ? "Session Expired"
                  : errorType === "account_banned"
                  ? "Access Restricted"
                  : "Welcome back"}
              </h1>
              <p className="text-slate-600">
                {errorType === "session_revoked"
                  ? "Please log in again to continue securely"
                  : errorType === "account_banned"
                  ? "Contact support to restore access"
                  : "Sign in to your account to continue"}
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={handleOauthLoginClick}
                variant="outline"
                className="w-full h-12 text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
                disabled={errorType === "account_banned"}
              >
                <GoogleIcon className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-slate-500">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form
              className="space-y-5"
              onSubmit={handleSubmit(handleUserLogin)}
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={errorType === "account_banned"}
                    {...register("email")}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={errorType === "account_banned"}
                    {...register("password")}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    disabled={errorType === "account_banned"}
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/auth/reset-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUserLoginPending || errorType === "account_banned"}
              >
                {isUserLoginPending
                  ? "Signing in..."
                  : errorType === "session_revoked"
                  ? "Sign In Again"
                  : "Sign In"}
              </Button>
            </form>

            {/* Account Banned Message */}
            {errorType === "account_banned" && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href =
                      "mailto:support@yourstore.com?subject=Account Suspension Appeal";
                  }}
                >
                  Contact Support
                </Button>
              </div>
            )}

            {/* Sign Up Link */}
            {errorType !== "account_banned" && (
              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  {"Don't have an account? "}
                  <Link
                    to="/auth/register"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
