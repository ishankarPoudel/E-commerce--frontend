import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/ui/shadcn/input-otp";
import { useMutation } from "@tanstack/react-query";
import { verifyOtpMutation } from "@/api/@tanstack/react-query.gen";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm({});

  const MAX_LENGTH = 6;

  const otpValue = watch("otp");

  //mutation to send the OTP for verification
  const { mutate } = useMutation({
    ...verifyOtpMutation(),
  });

  useEffect(() => {
    if (otpValue?.length === MAX_LENGTH) {
      // Auto-submit when OTP is complete
      onSubmit({ otp: otpValue });
    }
  }, [otpValue]);

  const onSubmit = (data: any) => {
    console.log("Submitting OTP:", data.otp);
    console.log("Submitting Email:", data.email);
    const email = localStorage.getItem("email");
    mutate(
      {
        body: {
          otp: data.otp,
          email: email as string,
        },
      },
      {
        onSuccess: (response) => {
          localStorage.removeItem("email");
          toast.success(response.message);
          navigate({
            to: "/auth/protected",
          });
        },
        onError: (error) => {
          toast.error(error.message || "Failed to verify OTP");
        },
      }
    );
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-100'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
        Enter Verification Code
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col items-center space-y-4'>
        <Controller
          control={control}
          name='otp'
          render={({ field }) => (
            <InputOTP
              maxLength={MAX_LENGTH}
              value={field.value}
              onChange={field.onChange}
              className='flex space-x-2'>
              <InputOTPGroup className='flex space-x-2'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className='w-12 h-14 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500'
                  />
                ))}
              </InputOTPGroup>

              <InputOTPSeparator className='mx-2 text-gray-400 text-xl font-medium'>
                -
              </InputOTPSeparator>

              <InputOTPGroup className='flex space-x-2'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <InputOTPSlot
                    key={index + 3}
                    index={index + 3}
                    className='w-12 h-14 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500'
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        <p className='text-gray-500 text-sm'>
          Didn’t receive the code?{" "}
          <a href='#' className='text-blue-500 hover:underline'>
            Resend
          </a>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
