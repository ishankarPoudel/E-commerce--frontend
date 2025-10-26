import {
  ArrayNotEmpty,
  IsArray,
  IsInstance,
  IsNotEmpty,
  ValidateIf,
} from "class-validator";

export class AddBagValidator {
  @IsNotEmpty({ message: "Bag name is required" })
  name!: string;

  @IsNotEmpty({ message: "Bag price is required" })
  price!: number;

  @IsNotEmpty({ message: "Bag description is required" })
  description!: string;

  @IsNotEmpty({ message: "Bag categories are required" })
  categories!: string[];

  @ValidateIf(
    (o) =>
      o.images !== undefined &&
      o.images !== null &&
      Array.isArray(o.images) &&
      o.images.length > 0
  ) // Only validate if images array is provided and not empty
  @IsArray({ message: "Images must be an array." })
  @ArrayNotEmpty({
    message: "At least one image is required if you are providing images.",
  }) // Or use @ArrayMinSize(1, {...})
  @IsInstance(File, {
    // This is crucial
    each: true, // Validate each element in the array
    message: "Each image must be a valid File object.",
  })
  images?: File[];
}
