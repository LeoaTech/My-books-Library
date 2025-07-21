import * as z from "zod";


export const schema = z.object({
    name: z.string().min(3, { message: "Please Enter a name" }),
    email: z.string().email({message: "Please Enter Email"}),
    order_by: z.string().min(1, { message: "Please Enter customer name" }),
    order_on: z.string(),
    payment_id: z.string(),
    mode_of_payment: z.string(),
    discount_code: z.string(),
    discount_value: z.number(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    phone: z.string(),
    shipping_address: z.string(),
    shipping_city: z.string(),
    shipping_country: z.string(),
    shipping_phone: z.string(),
  });