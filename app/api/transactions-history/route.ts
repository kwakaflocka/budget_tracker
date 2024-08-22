import { GetFormatterForWeight } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return new Response(JSON.stringify({ error: queryParams.error.message }), {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return new Response(JSON.stringify(transactions));
}

export type GetTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

// Function to fetch the transaction history with grower, strain, and category included
async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    throw new Error("user settings not found");
  }

  const formatter = GetFormatterForWeight(userSettings.weight);

  // Fetch transactions including product's grower, strain, and category
  const transactions = await prisma.transaction.findMany({
    where: {
     
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
    include: {
      product: {
        select: {
          product: true,  // Include product name
          category: {
            select: {
              name: true, // Include category name
              icon: true,
            },
          },
          grower: {
            select: {
              name: true, // Include grower name
              icon: true,
            },
          },
          strain: {
            select: {
              name: true, // Include strain name
              icon: true,
            },
          },
        },
      },
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    productName: transaction.product?.product || "Unknown Product",  // Add product name
    growerName: transaction.product?.grower?.name || "Unknown Grower",  // Add grower name
    strainName: transaction.product?.strain?.name || "Unknown Strain",  // Add strain name
    categoryName: transaction.product?.category?.name || "Unknown Category",  // Add category name
    growerIcon: transaction.product?.grower?.icon || "Unknown Grower",  // Add grower name
    strainIcon: transaction.product?.strain?.icon || "Unknown Strain",  // Add strain name
    categoryIcon: transaction.product?.category?.icon || "Unknown Category",  // Add category name
    formattedAmount: formatter.format(transaction.amount),  // Format the amount based on user weight
  }));
}
