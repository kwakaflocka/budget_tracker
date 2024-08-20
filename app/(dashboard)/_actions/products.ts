"use server";

import prisma from "@/lib/prisma";
import {
  CreateProductSchema,
  CreateProductSchemaType,
} from "@/schema/product";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function CreateProduct(form: CreateProductSchemaType) {
  const parsedBody = CreateProductSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, grower, strain, date, name, type } = parsedBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  const growerRow = await prisma.grower.findFirst({
    where: {
      name: grower,
    },
  });

  if (!growerRow) {
    throw new Error("grower not found");
  }
  const strainRow = await prisma.strain.findFirst({
    where: {
      name: strain,
    },
  });

  if (!growerRow) {
    throw new Error("grower not found");
  }
  // NOTE: don't make confusion between $transaction (prisma) and prisma.transaction (table)

  await prisma.$transaction([
    // Create user product
    prisma.product.create({
      data: {
        userId: user.id,
        amount,
        date,
        name: name || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
        grower: growerRow.name,
        growerIcon: growerRow.icon,
        strain: strainRow.name,
        strainIcon: strainRow.icon
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
    }),
  ]);
}