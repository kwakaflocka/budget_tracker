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

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  const growerRow = await prisma.grower.findFirst({
    where: {
      userId: user.id,
      name: grower,
    },
  });

  if (!growerRow) {
    throw new Error("grower not found");
  }

  const strainRow = await prisma.strain.findFirst({
    where: {
      userId: user.id,
      name: strain,
    },
  });

  if (!strainRow) {
    throw new Error("strain not found");
  }


  await prisma.transaction.create({
    data: {
      amount,
      category: categoryRow.name,
      categoryIcon: categoryRow.icon,
      grower: growerRow.name,
      growerIcon: growerRow.icon,
      strain: strainRow.name,
      strainIcon: strainRow.icon,
      description: description || "",
      date,
      type,
      userId: user.id,
    },
  })
  
  // Update month aggregate table
  await prisma.monthHistory.upsert({
    where: {
      day_month_year_userId: {
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
      returns: type === "returns" ? amount : 0,
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
  })
  
  // Update year aggreate
  await prisma.yearHistory.upsert({
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
      returns: type === "returns" ? amount : 0,
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
  })

}