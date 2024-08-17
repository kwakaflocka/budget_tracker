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

  const { amount, category, date, description, type } = parsedBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  // NOTE: don't make confusion between $transaction (prisma) and prisma.transaction (table)

  await prisma.$transaction([
    // Create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update month aggregate table
    prisma.monthHistory.upsert({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
<<<<<<< Updated upstream
        returns: type === "returns" ? amount : 0,
=======
        expense: type === "expense" ? amount : 0,
>>>>>>> Stashed changes
        order: type === "order" ? amount : 0,
      },
      update: {
        returns: {
          increment: type === "returns" ? amount : 0,
        },
        order: {
          increment: type === "order" ? amount : 0,
        },
      },
    }),

    // Update year aggregate
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
<<<<<<< Updated upstream
        returns: type === "returns" ? amount : 0,
=======
        expense: type === "expense" ? amount : 0,
>>>>>>> Stashed changes
        order: type === "order" ? amount : 0,
      },
      update: {
        returns: {
          increment: type === "returns" ? amount : 0,
        },
        order: {
          increment: type === "order" ? amount : 0,
        },
      },
    }),
  ]);
}