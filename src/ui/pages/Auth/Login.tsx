import { loginUserMutation } from "@/api/@tanstack/react-query.gen";
import GoogleIcon from "@/static/GoogleIcon";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import { getClientInfo } from "@/utils/getClientInfo";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldAlert,
  XCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [errorType, setErrorType] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
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
        case "guest_user":
          toast.info("Please login to continue", {
            duration: 4000,
          });
          break;
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
        case "token_expired":
        case "invalid_token":
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
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get("redirect") || "/";
          navigate({ to: redirect });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Login failed");
        },
      },
    );
  };

  // fn to handle oAuth login click
  const handleOauthLoginClick = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect") || "/";
    sessionStorage.setItem("oauth_redirect", redirect);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  // Get error alert configuration
  const getErrorAlert = () => {
    switch (errorType) {
      case "guest_user":
        return {
          icon: LogIn,
          variant: "default" as const,
          title: "Login Required",
          description:
            "Please sign in to access this feature. Create an account if you don't have one yet.",
          iconColor: "text-blue-600",
        };
      case "session_revoked":
        return {
          icon: ShieldAlert,
          variant: "destructive" as const,
          title: "Session Revoked",
          description:
            "For security reasons, an administrator has revoked your session. Please log in again to continue.",
          iconColor: "text-red-600",
        };
      case "account_banned":
        return {
          icon: XCircle,
          variant: "destructive" as const,
          title: "Account Suspended",
          description:
            "Your account has been suspended by an administrator. Please contact support for more information.",
          iconColor: "text-red-600",
        };
      case "session_expired":
      case "token_expired":
      case "invalid_token":
        return {
          icon: AlertTriangle,
          variant: "default" as const,
          title: "Session Expired",
          description:
            "Your session has expired due to inactivity. Please log in again to continue.",
          iconColor: "text-amber-600",
        };
      case "oauth_failed":
        return {
          icon: Info,
          variant: "default" as const,
          title: "OAuth Login Failed",
          description:
            "We couldn't complete your Google sign-in. Please try again or use email login below.",
          iconColor: "text-blue-600",
        };
      default:
        return null;
    }
  };

  const errorAlert = getErrorAlert();

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand Panel - Hidden on mobile, visible on lg+ */}
      <section className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/Gemini_Generated_Image_62kob362kob362ko.png')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="relative z-10 max-w-xl text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <svg
                  className="size-7 text-white"
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
              <span className="font-serif text-2xl tracking-wide">
                Avisekh Bag Pasal
              </span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-serif leading-tight">
              Premium bags, built for everyday carry
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Discover our curated collection of handcrafted bags designed for
              the modern explorer. Quality materials, timeless designs, and
              unmatched durability.
            </p>
          </div>

          {/* Product Showcase Grid */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
              "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400",
              "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
            ].map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <img
                  src={img}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Header with Background Image */}
      <section className="lg:hidden relative h-48 sm:h-64">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/Gemini_Generated_Image_62kob362kob362ko.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />

        <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
          <div className="animate-in fade-in duration-500 flex items-center gap-2 mb-2">
            <div className="size-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg
                className="size-5 text-white"
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
            <span className="text-white font-serif text-lg tracking-wide">
              Avisekh Bag Pasal
            </span>
          </div>
          <p className="animate-in fade-in duration-500 delay-100 text-white/80 text-sm">
            Premium bags, built for everyday carry
          </p>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="flex-1 lg:w-1/2 xl:w-[45%] flex items-center justify-center bg-background">
        <div className="w-full max-w-md px-6 py-12 lg:py-0">
          {/* Error Alert Banner */}
          {errorAlert && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
              <Alert variant={errorAlert.variant} className="border-2">
                <errorAlert.icon
                  className={`h-5 w-5 ${errorAlert.iconColor}`}
                />
                <div className="ml-2">
                  <div className="font-semibold mb-1">{errorAlert.title}</div>
                  <AlertDescription className="leading-relaxed text-sm">
                    {errorAlert.description}
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}

          {/* Desktop Header */}
          <div className="hidden lg:block mb-10 animate-in fade-in duration-500">
            <h1 className="font-serif text-3xl xl:text-4xl text-foreground mb-2 text-balance">
              {errorType === "session_revoked"
                ? "Session Expired"
                : errorType === "account_banned"
                  ? "Access Restricted"
                  : "Welcome back"}
            </h1>
            <p className="text-muted-foreground">
              {errorType === "session_revoked"
                ? "Please log in again to continue securely."
                : errorType === "account_banned"
                  ? "Contact support to restore access."
                  : "Sign in to access your account and continue your journey with us."}
            </p>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-serif text-2xl text-foreground mb-2">
              {errorType === "session_revoked"
                ? "Session Expired"
                : errorType === "account_banned"
                  ? "Access Restricted"
                  : "Welcome back"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {errorType === "account_banned"
                ? "Contact support to restore access"
                : "Sign in to continue your journey"}
            </p>
          </div>

          {/* Login Form */}
          <div className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
            <form
              onSubmit={handleSubmit(handleUserLogin)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground/80 text-sm tracking-wide uppercase"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={errorType === "account_banned"}
                  className="h-12 bg-card border-border/60 focus:border-accent transition-colors duration-200"
                  {...register("email")}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-foreground/80 text-sm tracking-wide uppercase"
                  >
                    Password
                  </Label>
                  <Link
                    to="/auth/reset-password"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={errorType === "account_banned"}
                    className="h-12 bg-card border-border/60 focus:border-accent transition-colors duration-200 pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isUserLoginPending || errorType === "account_banned"}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 text-sm tracking-wider uppercase font-medium"
              >
                {isUserLoginPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : errorType === "session_revoked" ? (
                  "Sign In Again"
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground tracking-widest">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleOauthLoginClick}
                disabled={errorType === "account_banned"}
                className="w-full h-12 border-border/60 hover:bg-secondary/50 transition-colors duration-200 bg-transparent"
              >
                <GoogleIcon className="mr-2 size-5" />
                Google
              </Button>

              {/* Account Banned Contact Support */}
              {errorType === "account_banned" && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => {
                    window.location.href =
                      "mailto:support@avisekh.com?subject=Account Suspension Appeal";
                  }}
                >
                  Contact Support
                </Button>
              )}
            </form>

            {errorType !== "account_banned" && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link
                  to="/auth/register"
                  className="font-medium text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  Create one
                </Link>
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border/40">
            <p className="text-center text-xs text-muted-foreground/70">
              By signing in, you agree to our{" "}
              <Link
                to="/legal/terms-of-use"
                className="underline hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/legal/privacy-policy"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Login;
