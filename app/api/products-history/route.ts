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

  const products = await getProductsHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return new Response(JSON.stringify(products));
}

export type GetProductHistoryResponseType = Awaited<
  ReturnType<typeof getProductsHistory>
>;

// Function to fetch the transaction history with grower, strain, and category included
async function getProductsHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    throw new Error("user settings not found");
  }

  const formatter = GetFormatterForWeight(userSettings.weight);

  // Fetch products including product's grower, strain, and category
  const products = await prisma.product.findMany({

    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true,  // Include category name
          icon: true,  // Include category icon
        },
      },
      grower: {
        select: {
          name: true,  // Include grower name
          icon: true,  // Include grower icon
        },
      },
      strain: {
        select: {
          name: true,  // Include strain name
          icon: true,  // Include strain icon
        },
      },
    },
  });
  

  return products.map((product) => ({
    ...product,
    productName: product?.product || "Unknown Product",  // Add product name
    growerName: product?.grower.name || "Unknown Grower",  // Add grower name
    strainName: product?.strain.name || "Unknown Strain",  // Add strain name
    categoryName: product?.category.name || "Unknown Category",  // Add category name
    growerIcon: product?.grower.icon || "Unknown Grower",  // Add grower name
    strainIcon: product?.strain.icon || "Unknown Strain",  // Add strain name
    categoryIcon: product?.category.icon || "Unknown Category",  // Add category name
    formattedAmount: formatter.format(product.quantity),
    date: product?.createdAt  // Format the amount based on user weight
  }));
}
