import * as z from "zod";

export const schema = z.object({
  shipping_address: z.string(),
  shipping_city: z.string(),
  shipping_country: z.string(),
  shipping_phone: z.string(),
});
