"use server";

import prisma from "@/lib/prisma";
import {
  CreateProductSchema,
  CreateProductSchemaType,
  DeleteProductSchema,
  DeleteProductSchemaType,
} from "@/schema/products";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function CreateProduct(form: CreateProductSchemaType) {
  const parsedBody = CreateProductSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon } = parsedBody.data;
  return await prisma.product.create({
    data: {
      product,
      icon
    },
  });
}

export async function DeleteProduct(form: DeleteProductSchemaType) {
  const parsedBody = DeleteProductSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error("bad request");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.product.delete({
    where: {
    
        product: parsedBody.data.name,
      
    },
  });
}
