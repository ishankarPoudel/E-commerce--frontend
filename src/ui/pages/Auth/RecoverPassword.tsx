import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { useMutation } from "@tanstack/react-query";
import { recoverPasswordMutation } from "@/api/@tanstack/react-query.gen";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export default function RecoverPassword({
  resetToken,
}: {
  resetToken: string;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const { mutate, isPending } = useMutation({
    ...recoverPasswordMutation(),
  });

  const validatePasswords = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};
    if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    mutate(
      {
        body: {
          newPassword,
          resetToken: resetToken,
        },
      },
      {
        onSuccess: (response) => {
          setIsLoading(false);
          navigate({ to: "/auth/login" });
          toast.success(response.message || "Password reset successfully");
        },
        onError: (error) => {
          setIsLoading(false);
          toast.error(error.message || "Failed to reset password");
        },
      }
    );
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
      <Card className='w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
        <CardHeader className='space-y-4 pb-6'>
          <div className='flex justify-center'>
            <div className='p-3 rounded-full bg-blue-100'>
              <Shield className='h-8 w-8 text-blue-600' />
            </div>
          </div>
          <div className='text-center space-y-2'>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              Reset Password
            </CardTitle>
            <CardDescription className='text-gray-600'>
              Create a new secure password for your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label
                htmlFor='new-password'
                className='text-sm font-medium text-gray-700'>
                New Password
              </Label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-4 w-4 text-gray-400' />
                </div>
                <Input
                  id='new-password'
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.newPassword ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder='Enter your new password'
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-400' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-400' />
                  )}
                </Button>
              </div>

              {newPassword && (
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs'>
                    <span className='text-gray-500'>Password strength</span>
                    <span
                      className={`font-medium ${
                        strength <= 2
                          ? "text-red-600"
                          : strength <= 3
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}>
                      {getStrengthText(strength)}
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p className='text-sm text-red-600'>{errors.newPassword}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='confirm-password'
                className='text-sm font-medium text-gray-700'>
                Confirm Password
              </Label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-4 w-4 text-gray-400' />
                </div>
                <Input
                  id='confirm-password'
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
                  placeholder='Confirm your new password'
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-400' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-400' />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-red-600'>{errors.confirmPassword}</p>
              )}
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h4 className='text-sm font-medium text-blue-900 mb-2'>
                Password Requirements:
              </h4>
              <ul className='text-xs text-blue-700 space-y-1'>
                <li className='flex items-center'>
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  At least 8 characters long
                </li>
                <li className='flex items-center'>
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Contains uppercase letter
                </li>
                <li className='flex items-center'>
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Contains number
                </li>
                <li className='flex items-center'>
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  Contains special character
                </li>
              </ul>
            </div>

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors duration-200'
              disabled={
                isLoading || isPending || !newPassword || !confirmPassword
              }>
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
