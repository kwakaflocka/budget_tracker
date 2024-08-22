"use client";

import { GetGrowersStatsResponseType } from "@/app/api/stats/growers/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForWeight } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function GrowersStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetGrowersStatsResponseType>({
    queryKey: ["overview", "stats", "growers", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/growers?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForWeight(userSettings.weight);
  }, [userSettings.weight]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <GrowersCard
          formatter={formatter}
          type="order"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <GrowersCard
          formatter={formatter}
          type="returns"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default GrowersStats;

function GrowersCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetGrowersStatsResponseType;
}) {
  const filteredData = data.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "order" ? "orders" : "returns"} by grower
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data for the selected period
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try adding new{" "}
              {type === "order" ? "orders" : "returns"}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.grower} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.growerIcon} {item.grower}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        type === "order" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
