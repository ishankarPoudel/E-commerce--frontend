import { IsNotEmpty, ValidateIf } from "class-validator";

export class AddBagValidator {
  @IsNotEmpty({ message: "Bag name is required" })
  bagName!: string;

  @IsNotEmpty({ message: "Bag price is required" })
  bagPrice!: number;

  @IsNotEmpty({ message: "Bag description is required" })
  bagDescription!: string;

  @IsNotEmpty({ message: "Bag categories are required" })
  bagCategory!: string[];

  @ValidateIf((o) => o instanceof File)
  @IsNotEmpty({ message: "Bag image is required" })
  bagImages!: File[];
}
