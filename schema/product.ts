import { z } from "zod";

export const CreateProductSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  name: z.string(),
  category: z.string(),
  grower: z.string(),
  strain: z.string(),
  type: z.string().default("order").refine((val) => ["order", "returns"].includes(val), {
    message: "Type must be either 'order' or 'returns'",
  }),
});

export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;