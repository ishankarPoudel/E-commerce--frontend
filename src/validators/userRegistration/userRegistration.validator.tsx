import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class userRegistrationValidator {
  @IsNotEmpty({ message: "FullName  is required" })
  @MinLength(3, {
    message: "FullName must be at least 3 characters long",
  })
  @MaxLength(16, {
    message: "FullName must not exceed 16 characters",
  })
  fullName!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, {
    message: "Password must be at least 8 characters long",
  })
  password!: string;

  @IsNotEmpty({ message: "You must agree to the terms and conditions" })
  termsAndConditions!: boolean;
}
