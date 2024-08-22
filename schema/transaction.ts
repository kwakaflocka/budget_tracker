import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  product: z.string(),
  description: z.string().nullable().optional(), // Make description optional
  date: z.coerce.date(),
  // categoryIcon: z.string().optional(),
  // category: z.string(),
  // grower: z.string(),
  // growerIcon: z.string().optional(),
  // strain: z.string(),
  // strainIcon: z.string().optional(),
  type: z.union([z.literal("order"), z.literal("returns")]),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
