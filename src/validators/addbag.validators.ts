export enum BagType {
  HANDBAG = "handbag",
  BACKPACK = "backpack",
  DUFFEL = "duffel",
  TOTE = "tote",
  CROSSBODY = "crossbody",
  LAPTOP_BAG = "laptop_bag",
  LUGGAGE = "luggage",
  SUITCASE = "suitcase",
  TRAVEL_SET = "travel_set",
  SCHOOL_BAG = "school_bag",
}

export interface ProductFormData {
  name: string;
  type: BagType;
  price: number;
  description: string;
  brand?: string;
  material?: string;
  colors?: string[];
  sizes?: string[];
  weightKg?: number;
  capacityLiters?: number;
  isFeatured?: boolean;
  categories?: string[];
  images?: [];
  features?: {
    hasWheels?: boolean;
    telescopicHandle?: boolean;
    expandable?: boolean;
    // School bag specific fields
    hasReflectiveStraps?: boolean;
    laptopCompartment?: boolean;
    // Laptop bag specific fields
    hasLaptopCompartment?: boolean;
    paddedStraps?: boolean;
    waterproof?: boolean;
    // Backpack specific fields
    chestStrap?: boolean;
    waterResistant?: boolean;
    hydrationPackCompatible?: boolean;
    // Duffel/Tote/Handbag/Crossbody specific fields
    innerPockets?: boolean;
    zipperClosure?: boolean;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateProductForm(data: ProductFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.name || data.name.trim() === "") {
    errors.push({ field: "name", message: "Product name is required" });
  }

  if (!data.type) {
    errors.push({
      field: "type",
      message: "Please select a valid product type",
    });
  } else if (!Object.values(BagType).includes(data.type)) {
    errors.push({
      field: "type",
      message: "Please select a valid product type",
    });
  }

  if (data.price === undefined || data.price === null) {
    errors.push({ field: "price", message: "Price is required" });
  } else if (typeof data.price !== "number" || isNaN(data.price)) {
    errors.push({ field: "price", message: "Price must be a valid number" });
  } else if (data.price < 0) {
    errors.push({
      field: "price",
      message: "Price must be greater than or equal to 0",
    });
  }

  // Optional numeric fields
  if (data.weightKg !== undefined && data.weightKg !== null) {
    if (typeof data.weightKg !== "number" || isNaN(data.weightKg)) {
      errors.push({
        field: "weightKg",
        message: "Weight must be a valid number",
      });
    } else if (data.weightKg < 0) {
      errors.push({
        field: "weightKg",
        message: "Weight must be greater than or equal to 0",
      });
    }
  }

  if (data.capacityLiters !== undefined && data.capacityLiters !== null) {
    if (typeof data.capacityLiters !== "number" || isNaN(data.capacityLiters)) {
      errors.push({
        field: "capacityLiters",
        message: "Capacity must be a valid number",
      });
    } else if (data.capacityLiters < 0) {
      errors.push({
        field: "capacityLiters",
        message: "Capacity must be greater than or equal to 0",
      });
    }
  }

  // Luggage/Suitcase specific validation
  if (
    data.type === BagType.LUGGAGE ||
    data.type === BagType.SUITCASE ||
    data.type === BagType.TRAVEL_SET
  ) {
    if (
      data.features?.hasWheels !== undefined &&
      typeof data.features.hasWheels !== "boolean"
    ) {
      errors.push({
        field: "hasWheels",
        message: "Has wheels must be a boolean",
      });
    }
    if (
      data.features?.telescopicHandle !== undefined &&
      typeof data.features.telescopicHandle !== "boolean"
    ) {
      errors.push({
        field: "telescopicHandle",
        message: "Telescopic handle must be a boolean",
      });
    }
    if (
      data.features?.expandable !== undefined &&
      typeof data.features.expandable !== "boolean"
    ) {
      errors.push({
        field: "expandable",
        message: "Expandable must be a boolean",
      });
    }
  }

  // School bag specific validation
  if (data.type === BagType.SCHOOL_BAG) {
    if (
      data.features?.hasReflectiveStraps !== undefined &&
      typeof data.features.hasReflectiveStraps !== "boolean"
    ) {
      errors.push({
        field: "hasReflectiveStraps",
        message: "Has reflective straps must be a boolean",
      });
    }
    if (
      data.features?.laptopCompartment !== undefined &&
      typeof data.features.laptopCompartment !== "boolean"
    ) {
      errors.push({
        field: "laptopCompartment",
        message: "Laptop compartment must be a boolean",
      });
    }
  }

  // Laptop bag specific validation
  if (data.type === BagType.LAPTOP_BAG) {
    if (
      data.features?.hasLaptopCompartment !== undefined &&
      typeof data.features.hasLaptopCompartment !== "boolean"
    ) {
      errors.push({
        field: "hasLaptopCompartment",
        message: "Has laptop compartment must be a boolean",
      });
    }
    if (
      data.features?.paddedStraps !== undefined &&
      typeof data.features.paddedStraps !== "boolean"
    ) {
      errors.push({
        field: "paddedStraps",
        message: "Padded straps must be a boolean",
      });
    }
    if (
      data.features?.waterproof !== undefined &&
      typeof data.features.waterproof !== "boolean"
    ) {
      errors.push({
        field: "waterproof",
        message: "Waterproof must be a boolean",
      });
    }
  }

  // Backpack specific validation
  if (data.type === BagType.BACKPACK) {
    if (
      data.features?.chestStrap !== undefined &&
      typeof data.features.chestStrap !== "boolean"
    ) {
      errors.push({
        field: "chestStrap",
        message: "Chest strap must be a boolean",
      });
    }
    if (
      data.features?.waterResistant !== undefined &&
      typeof data.features.waterResistant !== "boolean"
    ) {
      errors.push({
        field: "waterResistant",
        message: "Water resistant must be a boolean",
      });
    }
    if (
      data.features?.hydrationPackCompatible !== undefined &&
      typeof data.features.hydrationPackCompatible !== "boolean"
    ) {
      errors.push({
        field: "hydrationPackCompatible",
        message: "Hydration pack compatible must be a boolean",
      });
    }
  }

  // Duffel/Tote/Handbag/Crossbody specific validation
  if (
    data.type === BagType.DUFFEL ||
    data.type === BagType.TOTE ||
    data.type === BagType.HANDBAG ||
    data.type === BagType.CROSSBODY
  ) {
    if (
      data.features?.innerPockets !== undefined &&
      typeof data.features.innerPockets !== "boolean"
    ) {
      errors.push({
        field: "innerPockets",
        message: "Inner pockets must be a boolean",
      });
    }
    if (
      data.features?.zipperClosure !== undefined &&
      typeof data.features.zipperClosure !== "boolean"
    ) {
      errors.push({
        field: "zipperClosure",
        message: "Zipper closure must be a boolean",
      });
    }
  }

  return errors;
}
