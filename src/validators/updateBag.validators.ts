import {
  IsArray,
  IsInstance,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from "class-validator";

export class UpdateBagValidator {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @ValidateIf(
    (o) =>
      o.images !== undefined &&
      o.images !== null &&
      Array.isArray(o.images) &&
      o.images.length > 0
  ) // Only validate if images array is provided and not empty
  @IsArray({ message: "Images must be an array." })
  @IsInstance(File, {
    each: true, // Validate each element in the array
    message: "Each image must be a valid File object.",
  })
  @IsOptional()
  images?: File[];
}
