import { z } from "zod";

export const CreateTransactionSchema = z.object({
  type: z.string(),
  date: z.date(),
  description: z.string().optional(),
  amount: z.number(),
  strain: z.string().optional(),
  grower: z.string().optional(), // Add this line
});

export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;