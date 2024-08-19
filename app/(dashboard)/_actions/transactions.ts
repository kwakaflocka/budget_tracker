"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, grower, strain, date, description, type } = parsedBody.data;

  await prisma.transaction.create({
    data: {
      amount,
      category,
      strain,
      grower,
      date,
      type,
      userId: user.id,
      returns: type === "returns" ? amount : 0,
      expense: type === "expense" ? amount : 0,
      order: type === "order" ? amount : 0,
    },
    update: {
      amount,
      category,
      strain,
      grower,
      date,
      description,
      type,
      userId: user.id,
      day: date.getUTCDate(),
      month: date.getUTCMonth(),
      year: date.getUTCFullYear(),
      returns: type === "returns" ? amount : 0
    },
  });
}