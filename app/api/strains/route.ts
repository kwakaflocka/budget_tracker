import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);




  const strains = await prisma.strain.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(strains);
}
