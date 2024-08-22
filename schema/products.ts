import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.union([z.string(), z.undefined()]).optional(),
});

export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;

export const DeleteProductSchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.union([z.string(), z.undefined()]).optional(),
  });

export type DeleteProductSchemaType = z.infer<typeof DeleteProductSchema>;