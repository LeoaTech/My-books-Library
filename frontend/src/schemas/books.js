import * as z from "zod";

const selectOptionSchema = z
  .object({
    value: z.number().positive("Value must be a valid ID"),
    label: z.string().min(1, "Label is required"),
  })
  .nullable()
  .refine((val) => val !== null, { message: "Selection is required" });

export const bookSchema = z.object({
  title: z.string().min(3, { message: "Please Enter a title" }),
  member_price: z.string().optional(),
  purchase_price: z.string().optional(),
  condition: selectOptionSchema.transform((val) => val.value),
  cover: selectOptionSchema.transform((val) => val?.value),
  category: selectOptionSchema.transform((val) => val?.value),
  isbn: z.string().min(8, { message: "Please Enter book ISBN number" }),
  isAvailable: z.boolean().default(false),
  vendor_id: z.unknown().optional(), 
  branch_id: null || z.string(),
  cover_img_url:
    z
      .array(z.string())
      .max(5, { message: "Maximum 5 images allowed" })
      .optional() || z.unknown(),
  discount_percentage: z.string(),
  summary: z.string().optional(),
  publish_year: z.string().optional(),
  publisher: selectOptionSchema.transform((val) => val?.value) || z.unknown(), 
  credit: z
    .coerce.number()
    .min(1, { message: "Please add a valid credits for books" }) || z.unknown(),
  author: selectOptionSchema.transform((val) => val?.value) || z.unknown(), 
});

export const EditBookSchema = z.object({
  title: z.string().min(3, { message: "Title must be provided" }),
  member_price: z.string().min(1, { message: "Please Enter rent price" }),
  purchase_price: z.string().min(1, { message: "Please Enter purchase price" }),
  condition: z.string(),
  cover: z.string(),
  category: z.string(),
  isbn: z.string().min(8, { message: "Please Enter ISBN number" }),
  available: z.boolean(),
  vendor_id: z.unknown(),
  branch_id: null || z.unknown(),
  discount_percentage: z.string(),
  summary: z.string(),
  publish_year: z.string(),
  publisher: z.unknown(),
  credit: z.unknown(),
  author: z.unknown(),
});
