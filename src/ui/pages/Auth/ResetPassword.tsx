import type React from "react";

import { useState } from "react";

import { Loader2, Mail, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/card";
import { Label } from "@/ui/shadcn/label";
import { Input } from "@/ui/shadcn/input";
import { Button } from "@/ui/shadcn/button";
import { Link } from "@tanstack/react-router";
import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordMutation } from "@/api/@tanstack/react-query.gen";

type FormState = "initial" | "loading" | "user-found" | "error";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("initial");
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // mutataion to find the user  by email
  const { mutate, isPending } = useMutation({
    ...resetPasswordMutation(),
    onSuccess: (data) => {
      if (data) {
        setFormState("user-found");
      } else {
        setFormState("error");
      }
    },
    onError: (error) => {
      setFormState("error");
      setErrorMessage(error.message || "Something went wrong");
      console.log(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setFormState("loading");

    mutate({
      body: { email },
    });
  };

  const handleReset = () => {
    setEmail("");
    setFormState("initial");
    setEmailError("");
  };

  const renderInitialForm = () => (
    <>
      <CardHeader className='space-y-1 text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
          <Mail className='h-6 w-6 text-blue-600 dark:text-blue-400' />
        </div>
        <CardTitle className='text-2xl font-bold'>Forgot Password?</CardTitle>
        <CardDescription className='text-muted-foreground'>
          Enter your email address and we'll help you reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-sm font-medium'>
              Email Address
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={
                emailError ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              disabled={formState === "loading" && isPending}
              autoComplete='email'
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && (
              <p
                id='email-error'
                className='text-sm text-red-600 dark:text-red-400'
                role='alert'>
                {emailError}
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={formState === "loading"}>
            {formState === "loading" && isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Verifying Email...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <Link
            to='/auth/register'
            className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'>
            <ArrowLeft className='mr-1 h-4 w-4' />
            Back to Sign In
          </Link>
        </div>
      </CardContent>
    </>
  );

  const renderUserFound = () => (
    <>
      <CardHeader className='space-y-1 text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900'>
          <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
        </div>
        <CardTitle className='text-2xl font-bold'>Account Found!</CardTitle>
        <CardDescription className='text-muted-foreground'>
          We found your account associated with this email
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Alert className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'>
          <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
          <AlertDescription className='text-green-800 dark:text-green-200'>
            A password reset link has been sent to <strong>{email}</strong>.
            Please check your inbox and follow the instructions to reset your
            password.
          </AlertDescription>
        </Alert>

        <div className='space-y-2'>
          <Button
            onClick={handleReset}
            variant='outline'
            className='w-full bg-transparent'>
            Reset Another Account
          </Button>
          <Link to='/auth/login' className='block'>
            <Button variant='ghost' className='w-full'>
              Back to Sign In
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );

  const renderError = () => (
    <>
      <CardHeader className='space-y-1 text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900'>
          <XCircle className='h-6 w-6 text-red-600 dark:text-red-400' />
        </div>
        <CardTitle className='text-2xl font-bold'>
          Oops! Something Went Wrong
        </CardTitle>
        <CardDescription className='text-muted-foreground'>
          We encountered an error while processing your request
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Alert className='border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'>
          <XCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
          <AlertDescription className='text-red-800 dark:text-red-200'>
            {errorMessage ||
              "Either the email is invalid or the user does not exist. Please try again."}
          </AlertDescription>
        </Alert>

        <div className='space-y-2'>
          <Button onClick={handleReset} className='w-full'>
            Try Again
          </Button>
          <Link to='/auth/login' className='block'>
            <Button variant='ghost' className='w-full'>
              Back to Sign In
            </Button>
          </Link>
        </div>
      </CardContent>
    </>
  );

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <Card className='shadow-lg border-0 bg-white dark:bg-gray-800'>
          {formState === "initial" || formState === "loading"
            ? renderInitialForm()
            : null}
          {formState === "user-found" ? renderUserFound() : null}
          {formState === "error" ? renderError() : null}
        </Card>
      </div>
    </div>
  );
}
