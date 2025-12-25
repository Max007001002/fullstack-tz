import * as Yup from "yup";

const emptyToUndefined = (value: unknown, originalValue: unknown) => {
  if (originalValue === "" || originalValue === null) return undefined;
  return value;
};

export type RealEstateFormValues = {
  name: string;
  address: string;

  floor: number | "";
  totalFloors: number | "";

  square: number | "";
  livingSquare: number | "";
  kitchenSquare: number | "";

  dealType: "sale" | "rent";
  hasParking: boolean;
};

export const realEstateSchema = Yup.object({
  name: Yup.string().required(),
  address: Yup.string().required(),

  totalFloors: Yup.number()
    .transform(emptyToUndefined)
    .integer()
    .min(-3)
    .max(200)
    .required(),

  floor: Yup.number()
    .transform(emptyToUndefined)
    .integer()
    .min(-1)
    .when(
      "totalFloors",
      (totalFloors: unknown, schema: Yup.NumberSchema<number | undefined>) => {
      if (typeof totalFloors === "number") return schema.max(totalFloors);
      return schema;
      },
    )
    .required(),

  livingSquare: Yup.number()
    .transform(emptyToUndefined)
    .integer()
    .min(0)
    .required(),

  kitchenSquare: Yup.number()
    .transform(emptyToUndefined)
    .integer()
    .min(0)
    .required(),

  square: Yup.number()
    .transform(emptyToUndefined)
    .integer()
    .min(0)
    .max(400)
    .moreThanSumOfFields(
      ["kitchenSquare", "livingSquare"],
      "Общая площадь должна быть больше суммы жилой площади и площади кухни",
    )
    .required(),

  dealType: Yup.mixed<RealEstateFormValues["dealType"]>().oneOf(["sale", "rent"]).required(),
  hasParking: Yup.boolean().required(),
});
