import { IsNotEmpty, ValidateIf } from "class-validator";
export class AddCategoryValidator {
  @IsNotEmpty({ message: "Category name is required" })
  categoryName!: string;

  @ValidateIf((o) => o instanceof File)
  @IsNotEmpty({ message: "Bag image is required" })
  categoryImages!: File[];
}
