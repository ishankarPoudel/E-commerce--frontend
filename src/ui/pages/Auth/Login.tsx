import { loginUserMutation } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Separator } from "@/ui/shadcn/separator";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChromeIcon, Facebook, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // mutation to handle user login
  const { mutate, isPending: isUserLoginPending } = useMutation({
    ...loginUserMutation(),
  });

  //function to handle user login
  const handleUserLogin = (data: { email: string; password: string }) => {
    mutate(
      {
        body: {
          email: data.email,
          password: data.password,
        },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Login successful");
          navigate({
            to: "/auth/protected",
          });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Login failed");
        },
      }
    );
  };
  return (
    <div>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          {/* Main Card */}
          <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center'>
                <Lock className='w-8 h-8 text-white' />
              </div>
              <h1 className='text-2xl font-bold text-slate-900 mb-2'>
                Welcome back
              </h1>
              <p className='text-slate-600'>
                Sign in to your account to continue
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className='space-y-3 mb-6'>
              <Button
                variant='outline'
                className='w-full h-12 text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors'>
                <ChromeIcon className='w-5 h-5 mr-3' />
                Continue with Google
              </Button>
              <Button
                variant='outline'
                className='w-full h-12 text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors'>
                <Facebook className='w-5 h-5 mr-3 text-blue-600' />
                Continue with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className='relative mb-6'>
              <Separator />
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='bg-white px-4 text-sm text-slate-500'>
                  or continue with email
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form
              className='space-y-5'
              onSubmit={handleSubmit(handleUserLogin)}>
              {/* Email Field */}
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-slate-700'>
                  Email address
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email'
                    className='pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                    required
                    {...register("email")}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-slate-700'>
                  Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400' />
                  <Input
                    id='password'
                    type='password'
                    placeholder='Enter your password'
                    className='pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                    required
                    {...register("password")}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <input
                    id='remember'
                    type='checkbox'
                    className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500'
                  />
                  <Label htmlFor='remember' className='text-sm text-slate-600'>
                    Remember me
                  </Label>
                </div>
                <a
                  href='#'
                  className='text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'>
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <Button
                type='submit'
                className='w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl'>
                {isUserLoginPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className='mt-6 text-center'>
              <p className='text-slate-600'>
                {"Don't have an account? "}
                <Link
                  to='/auth/register'
                  className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className='text-center mt-6'>
            <p className='text-sm text-slate-500'>
              By signing in, you agree to our{" "}
              <a
                href='#'
                className='text-blue-600 hover:text-blue-700 transition-colors'>
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href='#'
                className='text-blue-600 hover:text-blue-700 transition-colors'>
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
