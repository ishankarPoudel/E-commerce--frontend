import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Separator } from "@/ui/shadcn/separator";
import { userRegistrationValidator } from "@/validators/userRegistration/userRegistration.validator";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { registerUserMutation } from "@/api/@tanstack/react-query.gen";
import GoogleIcon from "@/static/GoogleIcon";

const Registration = () => {
  const navigate = useNavigate({ from: "/auth/register" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userRegistrationValidator>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      termsAndConditions: false,
    },
    resolver: classValidatorResolver(userRegistrationValidator),
  });

  // mutation to send the  the otp to the user's email
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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Main Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center'>
              <User className='w-8 h-8 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-slate-900 mb-2'>
              Create your account
            </h1>
            <p className='text-slate-600'>
              Join us today and get started in minutes
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className='space-y-3 mb-6'>
            <Button
              onClick={handleGoogleOAuthClick}
              variant='outline'
              className='w-full h-12 text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors'>
              <GoogleIcon className='w-5 h-5 mr-3' />
              Sign up with Google
            </Button>
          </div>

          {/* Divider */}
          <div className='relative mb-6'>
            <Separator />
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='bg-white px-4 text-sm text-slate-500'>
                or sign up with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form
            className='space-y-5'
            onSubmit={handleSubmit(handleUserRegistration)}>
            {/* Full Name Field */}
            <div className='space-y-2'>
              <Label
                htmlFor='fullName'
                className='text-sm font-medium text-slate-700'>
                Full name
              </Label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400' />
                <Input
                  id='fullName'
                  {...register("fullName")}
                  type='text'
                  placeholder='Enter your full name'
                  className='pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                />
                {errors.fullName && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>

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
                  {...register("email")}
                  type='email'
                  placeholder='Enter your email'
                  className='pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                />
                {errors.email && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.email.message}
                    {}
                  </p>
                )}
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
                  {...register("password")}
                  type='password'
                  placeholder='Create a strong password'
                  className='pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <p className='text-xs text-slate-500 mt-1'>
                Password must be at least 8 characters long
              </p>
              {errors.password && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className='flex items-start space-x-2'>
              <input
                id='terms'
                type='checkbox'
                className='w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5'
                {...register("termsAndConditions")}
              />
              {errors.termsAndConditions && (
                <p className='text-red-500 text-xs mt-1'>
                  {errors.termsAndConditions.message}
                </p>
              )}
              <Label
                htmlFor='terms'
                className='text-sm text-slate-600 leading-relaxed'>
                I agree to the{" "}
                <a
                  href='#'
                  className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href='#'
                  className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>
                  Privacy Policy
                </a>
              </Label>
            </div>

            {/* Create Account Button */}
            <Button
              type='submit'
              className='w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl'>
              {isEmailSending ? <Loader /> : "Create Account"}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className='mt-6 text-center'>
            <p className='text-slate-600'>
              Already have an account?{" "}
              <Link
                to='/auth/login'
                className='text-blue-600 hover:text-blue-700 font-medium transition-colors'>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center mt-6'>
          <p className='text-sm text-slate-500'>
            By creating an account, you agree to receive updates and promotional
            emails.{" "}
            <a
              href='#'
              className='text-blue-600 hover:text-blue-700 transition-colors'>
              Unsubscribe anytime
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
