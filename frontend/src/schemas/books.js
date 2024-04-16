import * as z from "zod";

export const bookSchema = z.object({
  title: z.string().min(3, { message: "Please Enter a title" }),
  rental_price: z.string().min(1, { message: "Please Enter a price" }),
  purchase_price: z.string().min(1, { message: "Please Enter a price" }),
  condition: z.string(),
  cover: z.string(),
  category: z.string(),
  isbn: z.string().min(8, { message: "Please Enter a ISBN number" }),
  isAvailable: z.boolean(),
  vendor_id: z.string().min(1, { message: "Please Enter Vendor ID" }),
  branch_id: null || z.string(),
  cover_img_url: z.unknown(),
  discount_percentage: z.string(),
  summary: z.string(),
  publish_year: z.string(),
  publisher: z.unknown(),
  credit: z.string(),
  author: z.unknown(),
});



export const EditBookSchema = z.object({
  title: z.string().min(3, { message: "Title must be provided" }),
  rental_price: z.string().min(1, { message: "Please Enter rent price" }),
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