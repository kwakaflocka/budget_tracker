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
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const inventorys = await getInventorysHistory(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(inventorys);
}

export type GetInventoryHistoryResponseType = Awaited<
  ReturnType<typeof getInventorysHistory>
>;

async function getInventorysHistory(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    throw new Error("user settings not found");
  }

  const formatter = GetFormatterForWeight(userSettings.weight);

  const inventorys = await prisma.product.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return inventorys.map((inventory) => ({
    ...inventory,
    // lets format the amount with the user weight
    formattedAmount: formatter.format(inventory.amount),
  }));
}
