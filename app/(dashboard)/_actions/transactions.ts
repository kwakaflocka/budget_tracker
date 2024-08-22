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

  const { product, amount,  date, description, type } = parsedBody.data;

  const productRow = await prisma.product.findFirst({
    where: {
      product: parsedBody.data.product,  // Assuming you're searching by product name
    },
  });

  if (!productRow) {
    throw new Error("product not found");
  }

  const categoryRow = await prisma.category.findFirst({
    where: {
    
      // name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  const growerRow = await prisma.grower.findFirst({
    where: {
    
      // name: grower,
    },
  });

  if (!growerRow) {
    throw new Error("grower not found");
  }

  const strainRow = await prisma.strain.findFirst({
    where: {
   
      // name: strain,
    },
  });

  if (!strainRow) {
    throw new Error("strain not found");
  }


  await prisma.transaction.create({
    data: {
      product,
      amount,
      productId: productRow.id,
      description: description || "",
      date,
      type
    },
  })
  
  await prisma.product.upsert({
    where: {
      product: parsedBody.data.product,  // Assuming 'product' is a unique field in your schema
    },
    update: {
      quantity: {
        increment: +amount,  // Increment the quantity by 'amount'
      },
    },
    create: {
      product: parsedBody.data.product,  // Create a new product if it doesn't exist
      quantity: +amount,                 // Initialize the quantity with the given amount                // Set other fields as necessary
      createdAt: new Date(),
      updatedAt: new Date(),
      strain: {
        connect: { id: strainRow.id },   // Connect to an existing strain
      },
      grower: {
        connect: { id: growerRow.id },   // Connect to an existing grower
      },
      category: {
        connect: { id: categoryRow.id }, // Connect to an existing category
      },
      // Add other optional fields if necessary (icon, etc.)
    },
  });
  
  // Update month aggregate table
  await prisma.monthHistory.upsert({
    where: {
      day_month_year: {
      
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
      month_year: {
       
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