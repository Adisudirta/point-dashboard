import type { ColumnDef } from "@tanstack/react-table";

import { Coins } from "lucide-react";
import { DataTable } from "~/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type Leaderboard = {
  rank: number;
  username: string;
  totalPoint: number;
};

const dataDummy: Leaderboard[] = [
  {
    rank: 1,
    username: "JohnDoe",
    totalPoint: 1500,
  },
  {
    rank: 2,
    username: "JaneDoe",
    totalPoint: 2000,
  },
  {
    rank: 3,
    username: "Alice",
    totalPoint: 1800,
  },
  {
    rank: 4,
    username: "Bob",
    totalPoint: 1200,
  },
  {
    rank: 5,
    username: "Eve",
    totalPoint: 2200,
  },
];

export const columns: ColumnDef<Leaderboard>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => <span>#{row.getValue("rank")}</span>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-600">
        {row.getValue("username")}
      </span>
    ),
  },
  {
    accessorKey: "totalPoint",
    header: "Total Point",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Coins className="text-yellow-500 mr-2" />
        <span className="font-semibold text-yellow-500">
          {row.getValue("totalPoint")}
        </span>
      </div>
    ),
  },
];

export default function Leaderboard() {
  return (
    <div className="container flex justify-center pt-[calc(25px+80px)]">
      <Card className="w-full md:w-[800px]">
        <CardHeader>
          <CardTitle className="text-center text-sm md:text-2xl">
            👑Primakara Developers Leaderboard👑
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-auto">
          <div className="w-[450px] md:w-full">
            <DataTable columns={columns} data={dataDummy} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
