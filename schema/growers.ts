import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CreateGrowerSchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().max(20),
  type: z.enum(["income", "expense"]),
});

export type CreateGrowerSchemaType = z.infer<typeof CreateGrowerSchema>;

export const DeleteGrowerSchema = z.object({
  name: z.string().min(3).max(20),
  type: z.enum(["income", "expense"]),
});

export type DeleteGrowerSchemaType = z.infer<typeof DeleteGrowerSchema>;

export const CreateGrower = async (data: CreateGrowerSchemaType) => {
  const parsedData = CreateGrowerSchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Invalid data");
  }

  return await prisma.grower.create({
    data: parsedData.data,
  });
};