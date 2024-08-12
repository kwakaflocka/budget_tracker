"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";

type StrainRow = {
  id: string;
  createdAt: Date;
  name: string;
  userId: string;
  icon: string;
  type: string;
};

type GrowerRow = {
  id: string;
  createdAt: Date;
  name: string;
  userId: string;
  icon: string;
  type: string;
};

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, strain, grower, date, description, type } = parsedBody.data;
  const strainRow: StrainRow | null = await prisma.strain.findFirst({
    where: {
      userId: user.id,
      name: strain,
    },
  });

  if (!strainRow) {
    throw new Error("strain not found");
  }

  const growerRow: GrowerRow | null = await prisma.grower.findFirst({
    where: {
      userId: user.id,
      name: grower,
    },
  });

  if (!growerRow) {
    throw new Error("grower not found");
  }

  await prisma.transaction.create({
    data: {
      amount,
      strainId: strainRow.id,
      growerId: growerRow.id,
      date,
      description,
      type,
      userId: user.id,
    },
  });
}