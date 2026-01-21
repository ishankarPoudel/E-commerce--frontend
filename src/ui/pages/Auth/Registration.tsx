import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { userRegistrationValidator } from "@/validators/userRegistration/userRegistration.validator";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { registerUserMutation } from "@/api/@tanstack/react-query.gen";
import GoogleIcon from "@/static/GoogleIcon";
import { useState } from "react";

const Registration = () => {
  const navigate = useNavigate({ from: "/auth/register" });
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userRegistrationValidator>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      termsAndConditions: true, // Auto-accept terms
    },
    resolver: classValidatorResolver(userRegistrationValidator),
  });

  // mutation to send the otp to the user's email
  const { mutate, isPending: isEmailSending } = useMutation({
    ...registerUserMutation(),
  });

  //function to handle user registration
  const handleUserRegistration = (data: userRegistrationValidator) => {
    console.log("Form data:", data);

    mutate(
      {
        body: {
          email: data.email,
          fullName: data.fullName,
          password: data.password,
        },
      },
      {
        onSuccess: (response) => {
          localStorage.setItem("email", data.email);
          console.log("Registration successful!", response);
          navigate({
            to: "/auth/register/verify-otp",
          });
          toast.success(response.message);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Registration failed");
        },
      }
    );
  };

  //fn to trigger google oauth
  const handleGoogleOAuthClick = () => {
    const url = `${import.meta.env.VITE_API_URL}/auth/google`;
    console.log("Redirecting to:", url);
    window.location.href = url;
  };

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand Panel - Hidden on mobile, visible on lg+ */}
      <section className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/Gemini_Generated_Image_62kob362kob362ko.png')] bg-cover bg-center opacity-20" />

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
              Join our community of explorers
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Start your journey with premium bags designed for everyday
              adventures. Exclusive member benefits, quality craftsmanship, and
              exceptional service await.
            </p>
          </div>

          {/* Customer Stats */}
          <div className="space-y-6 pt-8">
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">100K+</h3>
                  <p className="text-sm text-white/70">Satisfied Customers</p>
                </div>
                <div className="flex -space-x-3">
                  {[
                    "https://i.pravatar.cc/150?img=1",
                    "https://i.pravatar.cc/150?img=5",
                    "https://i.pravatar.cc/150?img=8",
                    "https://i.pravatar.cc/150?img=12",
                  ].map((avatar, idx) => (
                    <div
                      key={idx}
                      className="size-10 rounded-full border-2 border-slate-900 overflow-hidden"
                    >
                      <img
                        src={avatar}
                        alt={`Customer ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
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
            Join our community of explorers
          </p>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="flex-1 lg:w-1/2 xl:w-[45%] flex items-center justify-center bg-background">
        <div className="w-full max-w-md px-6 py-12 lg:py-0">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-10 animate-in fade-in duration-500">
            <h1 className="font-serif text-3xl xl:text-4xl text-foreground mb-2 text-balance">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Join us today and start your journey with premium bags crafted for
              everyday adventures.
            </p>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-serif text-2xl text-foreground mb-2">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm">
              Join our community today
            </p>
          </div>

          {/* Registration Form */}
          <div className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
            <form
              onSubmit={handleSubmit(handleUserRegistration)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-foreground/80 text-sm tracking-wide uppercase"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-12 bg-card border-border/60 focus:border-accent transition-colors duration-200"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                  className="h-12 bg-card border-border/60 focus:border-accent transition-colors duration-200"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground/80 text-sm tracking-wide uppercase"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters long
                </p>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isEmailSending}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 text-sm tracking-wider uppercase font-medium"
              >
                {isEmailSending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Terms Agreement Text */}
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                By signing up, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-accent hover:text-accent/80 font-medium transition-colors underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-accent hover:text-accent/80 font-medium transition-colors underline"
                >
                  Privacy Policy
                </a>
              </p>

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
                onClick={handleGoogleOAuthClick}
                className="w-full h-12 border-border/60 hover:bg-secondary/50 transition-colors duration-200 bg-transparent"
              >
                <GoogleIcon className="mr-2 size-5" />
                Google
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-accent hover:text-accent/80 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
        </div>
      </section>
    </main>
  );
};

export default Registration;
