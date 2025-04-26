import { IsNotEmpty, ValidateIf } from "class-validator";

export class AddBagValidator {
  @IsNotEmpty({ message: "Bag name is required" })
  name!: string;

  @IsNotEmpty({ message: "Bag price is required" })
  price!: number;

  @IsNotEmpty({ message: "Bag description is required" })
  description!: string;

  @IsNotEmpty({ message: "Bag categories are required" })
  categories!: string[];

  @ValidateIf((o) => o instanceof File)
  @IsNotEmpty({ message: "Bag image is required" })
  images!: File[];
}
