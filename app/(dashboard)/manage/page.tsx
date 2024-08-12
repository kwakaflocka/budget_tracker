"use client";

import CreateStrainDialog from "@/app/(dashboard)/_components/CreateStrainDialog";
import DeleteStrainDialog from "@/app/(dashboard)/_components/DeleteStrainDialog";
import CreateGrowerDialog from "@/app/(dashboard)/_components/CreateGrowerDialog"; // Assuming this component exists
import { UnitComboBox } from "@/components/UnitComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Strain } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrashIcon } from "lucide-react";
import React from "react";

function page() {
  return (
    <>
      {/* HEADER */}
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and more.
            </p>
          </div>
        </div>
      </div>
      {/* END HEADER */}
      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Unit</CardTitle>
            <CardDescription>
              Set your default Unit for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnitComboBox />
          </CardContent>
        </Card>
        <StrainList />
        <GrowerList />
      </div>
    </>
  );
}

export default page;

function StrainList() {
  const strainsQuery = useQuery({
    queryKey: ["strains"],
    queryFn: () => fetch(`/api/strains`).then((res) => res.json()),
  });

  const isLoading = strainsQuery.isLoading;
  const dataAvailable = strainsQuery.data && strainsQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                Strains
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateStrainDialog
              successCallback={() => strainsQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create strain
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>No strains yet</p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {strainsQuery.data.map((strain: Strain) => (
              <StrainCard strain={strain} key={strain.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function StrainCard({ strain }: { strain: Strain }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {strain.icon}
        </span>
        <span>{strain.name}</span>
      </div>
      <DeleteStrainDialog
        strain={strain}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
}

function GrowerList() {
  const growersQuery = useQuery({
    queryKey: ["growers"],
    queryFn: () => fetch(`/api/growers`).then((res) => res.json()),
  });

  const isLoading = growersQuery.isLoading;
  const dataAvailable = growersQuery.data && growersQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div>
                Growers
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateGrowerDialog
              successCallback={() => growersQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create grower
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>No growers yet</p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {growersQuery.data.map((grower: any) => (
              <GrowerCard grower={grower} key={grower.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function GrowerCard({ grower }: { grower: any }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {grower.icon}
        </span>
        <span>{grower.name}</span>
      </div>
      <Button
        className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
        variant={"secondary"}
      >
        <TrashIcon className="h-4 w-4" />
        Remove
      </Button>
    </div>
  );
}