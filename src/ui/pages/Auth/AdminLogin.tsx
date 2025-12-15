import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/card";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Button } from "@/ui/shadcn/button";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { adminLoginMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //mutation to handle admin login
  const {
    mutate: adminLogin,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    ...adminLoginMutation(),
  });

  const handleBtnClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    adminLogin(
      {
        body: {
          email,
          password,
        },
      },
      {
        onSuccess: () => {
          toast.success("Admin login successful!");

          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = "/admin-dashboard";
          }, 1500);
        },
        onError: (error: any) => {
          toast.error(
            error?.message || "Login failed. Please check your credentials."
          );
        },
      }
    );
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-zinc-800 p-4">
              <ShieldCheck className="h-8 w-8 text-zinc-100" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-zinc-50">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Restricted access for authorized administrators only
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleBtnClick}>
            {isError && (
              <div className="text-red-400 text-center text-sm bg-red-950/50 border border-red-800 rounded-md p-3">
                Login failed. Please check your credentials.
              </div>
            )}

            {isSuccess && (
              <div className="text-green-400 text-center text-sm bg-green-950/50 border border-green-800 rounded-md p-3">
                Login successful! Redirecting...
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">
                Email Address
              </Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="admin@company.com"
                required
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">
                Password
              </Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Logging in..." : "Admin Login"}
            </Button>

            <p className="text-center text-xs text-zinc-500">
              This system is for authorized personnel only. Unauthorized access
              attempts will be logged and investigated.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
