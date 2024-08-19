import { z } from "zod";

export const CreateGrowerSchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.string().default("order").refine((val) => ["order", "returns"].includes(val), {
    message: "Type must be either 'order' or 'returns'",
  }),
});

export type CreateGrowerSchemaType = z.infer<typeof CreateGrowerSchema>;

export const DeleteGrowerSchema = z.object({
  name: z.string().min(3).max(20),
  type: z.string().default("order").refine((val) => ["order", "returns"].includes(val), {
    message: "Type must be either 'order' or 'returns'",
  }),
});

export type DeleteGrowerSchemaType = z.infer<typeof DeleteGrowerSchema>;