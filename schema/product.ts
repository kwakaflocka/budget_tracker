import { z } from "zod";

export const CreateProductSchema = z.object({
  product: z.coerce.string(),
  quantity: z.coerce.number().min(0).multipleOf(0.01).default(0), // Make it optional with a default value of 0
  createdAt: z.coerce.date(),
  categoryIcon: z.string().optional(),
  category: z.string(),
  grower: z.string(),
  growerIcon: z.string().optional(),
  strain: z.string(),
  strainIcon: z.string().optional(),
  icon: z.string().nullable(),
});

export type CreateProductSchemaType = z.infer<
  typeof CreateProductSchema
>;
export const DeleteProductSchema = z.object({
  id: z.number(), // Using ID instead of name for deletion
});

export type DeleteProductSchemaType = z.infer<typeof DeleteProductSchema>;